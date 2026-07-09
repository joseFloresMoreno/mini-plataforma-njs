import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getCourseById } from "@/lib/lms-data";

export async function POST(req: Request) {
  try {
    const { messages, courseId } = await req.json();

    if (!courseId) {
      return new Response("Missing courseId", { status: 400 });
    }

    const course = getCourseById(courseId);
    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    // Build a text reference of the course contents
    const courseContentText = course.modules
      .map((mod) => {
        const sectionsText = mod.sections
          .map((sec) => `  * Sección: ${sec.title}\n    Contenido: ${sec.summary}`)
          .join("\n\n");
        return `Módulo: ${mod.title}\n${sectionsText}`;
      })
      .join("\n\n====================\n\n");

    const systemPrompt = `Eres el asistente inteligente oficial de la plataforma educativa para el curso "${course.title}".
Tu objetivo es ayudar de forma atenta y didáctica exclusivamente con dudas relacionadas a este curso.

Aquí tienes el contenido completo del curso como referencia:
=========================================
Título: ${course.title}
Descripción: ${course.description}

${courseContentText}
=========================================

REGLAS ESTRICTAS DE RESPUESTA:
1. SOLO puedes responder preguntas que tengan relación directa con el curso "${course.title}" o el contenido del curso listado arriba.
2. Si la consulta del usuario trata sobre cualquier otro tema que NO esté relacionado con "${course.title}" (por ejemplo: otros lenguajes de programación, temas generales, tareas externas, recetas ajenas al curso, etc.), debes rechazar responder amablemente. Di textualmente que como tutor del curso "${course.title}", solo estás capacitado para responder dudas sobre este tema en concreto e invita al usuario a enfocarse en la materia del curso.
3. Responde siempre en español, con un tono motivador, claro y conciso. Puedes usar formato Markdown básico para hacer listas o destacar texto.`;

    // Convert UIMessages (which might have parts) into CoreMessages (which require content string)
    const coreMessages = messages.map((m: any) => {
      let content = "";
      if (typeof m.content === "string" && m.content) {
        content = m.content;
      } else if (Array.isArray(m.parts)) {
        content = m.parts
          .map((part: any) => {
            if (part.type === "text") {
              return part.text;
            }
            return "";
          })
          .join("");
      }
      return {
        role: m.role,
        content: content,
      };
    });

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: coreMessages,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
