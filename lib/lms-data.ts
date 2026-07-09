import { createClient } from "@vercel/kv";

export type DemoRole = "student" | "admin";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
};

export type CourseSection = {
  id: string;
  title: string;
  summary: string;
  html: string;
  videoUrl: string;
  durationMinutes: number;
  quiz?: QuizQuestion[];
};

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  sections: CourseSection[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  overview: string;
  level: string;
  duration: string;
  instructor: string;
  accent: string;
  modules: CourseModule[];
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
  enrolledCourseIds: string[];
};

export type DashboardCourse = Course & {
  completedSections: number;
  totalSections: number;
  progressPercent: number;
  nextSectionTitle: string | null;
};

const videoPlaceholder = "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U";

export const demoUsers: DemoUser[] = [
  {
    id: "user-ana",
    name: "Ana Torres",
    email: "ana@demo.com",
    password: "lms123",
    role: "student",
    enrolledCourseIds: ["sopaipillas", "suculentas"],
  },
  {
    id: "user-carlos",
    name: "Carlos Mendoza",
    email: "carlos@demo.com",
    password: "lms123",
    role: "student",
    enrolledCourseIds: ["sopaipillas"],
  },
  {
    id: "user-admin",
    name: "Administrador",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
    enrolledCourseIds: ["sopaipillas", "suculentas"],
  },
];

export const demoCourses: Course[] = [
  {
    id: "sopaipillas",
    slug: "instrucciones-sopaipillas",
    title: "Instrucciones para hacer Sopaipillas",
    description:
      "Aprende la receta tradicional chilena para preparar las sopaipillas perfectas paso a paso.",
    overview:
      "Este curso cubre todo el proceso: desde la selección de ingredientes, el zapallo ideal, el amasado correcto y los secretos para una fritura perfecta.",
    level: "Básico",
    duration: "1h 30m",
    instructor: "Chef Tradicional",
    accent: "from-amber-400 to-orange-600",
    modules: [
      {
        id: "sop-m1",
        title: "Preparación de la Masa",
        description: "Ingredientes y técnicas de amasado.",
        sections: [
          {
            id: "sop-m1-s1",
            title: "Ingredientes Básicos",
            summary: "Los componentes esenciales de la masa.",
            html: `
              <p>Las sopaipillas chilenas tradicionales se distinguen por el uso de zapallo cocido en la masa.</p>
              <ul>
                <li>2 tazas de harina sin polvos de hornear.</li>
                <li>1 taza de zapallo molido cocido (tibio).</li>
                <li>3 cucharadas de manteca derretida.</li>
                <li>1 cucharadita de sal.</li>
              </ul>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
          {
            id: "sop-m1-s2",
            title: "Amasado y Estirado",
            summary: "Cómo lograr la consistencia ideal y cortar las sopaipillas.",
            html: `
              <p>Junta los ingredientes secos, haz un pozo en el centro y agrega el zapallo molido junto con la manteca derretida tibia. Amasa hasta lograr una masa suave y homogénea.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
          },
        ],
      },
      {
        id: "sop-m2",
        title: "Fritura y Evaluación",
        description: "El proceso final y evaluación del aprendizaje.",
        sections: [
          {
            id: "sop-m2-s1",
            title: "El Arte de Freír",
            summary: "Temperatura y tiempos para que queden crujientes y doradas.",
            html: `
              <p>Fríe las sopaipillas en abundante aceite bien caliente (a unos 175°C) por unos 2 a 3 minutos por lado, hasta que estén doradas. Escurre en papel absorbente antes de servir.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
          {
            id: "sop-m2-s2",
            title: "Cuestionario de Certificación",
            summary: "Responde las preguntas finales para completar y cerrar el curso.",
            html: `
              <p>Responde correctamente todas las preguntas para desbloquear la finalización de este curso.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
            quiz: [
              {
                id: "sop-q1",
                question: "¿Cuál es el ingrediente estrella que le da el color amarillo característico a la sopaipilla chilena?",
                options: ["Papas", "Zapallo camote", "Zanahoria", "Maíz"],
                correctOptionIndex: 1,
              },
              {
                id: "sop-q2",
                question: "¿A qué temperatura aproximada debe estar el aceite para freír las sopaipillas?",
                options: ["100°C", "175°C", "300°C", "50°C"],
                correctOptionIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "suculentas",
    slug: "cuidados-suculentas",
    title: "Cuidados generales para suculentas en casa",
    description:
      "Guía práctica para mantener tus suculentas sanas, fuertes y hermosas en interiores o terrazas.",
    overview:
      "Aprende sobre la iluminación necesaria, la técnica correcta de riego para evitar la pudrición, y cómo preparar el sustrato drenante ideal.",
    level: "Básico",
    duration: "2h 00m",
    instructor: "Especialista en Botánica",
    accent: "from-emerald-400 to-teal-600",
    modules: [
      {
        id: "suc-m1",
        title: "Luz y Riego",
        description: "Los dos pilares fundamentales del cuidado.",
        sections: [
          {
            id: "suc-m1-s1",
            title: "Requisitos de Iluminación",
            summary: "Cuánta luz necesitan y cómo detectar la falta de sol.",
            html: `
              <p>Las suculentas aman la luz solar. Requieren de 4 a 6 horas de sol diario filtrado o directo suave para evitar la etiolación (cuando se estiran buscando luz).</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
          {
            id: "suc-m1-s2",
            title: "Método de Riego",
            summary: "El secreto del riego: remojo y secado.",
            html: `
              <p>El error número uno es el riego excesivo. Riega de forma abundante hasta que el agua salga por el drenaje, y no vuelvas a regar hasta que la tierra esté 100% seca.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
        ],
      },
      {
        id: "suc-m2",
        title: "Sustrato y Evaluación",
        description: "Preparación de la maceta y prueba final.",
        sections: [
          {
            id: "suc-m2-s1",
            title: "Tierra y Drenaje",
            summary: "Preparando el hogar perfecto para tu suculenta.",
            html: `
              <p>Usa un sustrato especial para cactus y suculentas que contenga arena gruesa, perlita y turba. La maceta SIEMPRE debe tener agujero de drenaje en la base.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
          },
          {
            id: "suc-m2-s2",
            title: "Evaluación del Jardinero",
            summary: "Demuestra tus conocimientos para finalizar el curso.",
            html: `
              <p>Responde correctamente todas las preguntas para desbloquear la finalización de este curso.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 15,
            quiz: [
              {
                id: "suc-q1",
                question: "¿Con qué frecuencia se deben regar las suculentas por lo general?",
                options: [
                  "Todos los días",
                  "Solo cuando el sustrato esté completamente seco",
                  "Una vez al año",
                  "Cada dos horas",
                ],
                correctOptionIndex: 1,
              },
              {
                id: "suc-q2",
                question: "¿Qué es fundamental que tenga la maceta de una suculenta?",
                options: [
                  "Pintura brillante",
                  "Orificio de drenaje",
                  "Color rojo",
                  "Tapa hermética",
                ],
                correctOptionIndex: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

const isKvConfigured = !!(
  process.env.KV_URL ||
  process.env.KV_REST_API_URL ||
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.UPSTASH_REDIS_REST_TOKEN
);

const kvClient = isKvConfigured
  ? createClient({
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || "",
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  : null;

// Fallback in-memory progress for local development or when KV is not set up
const localProgress: Record<string, Record<string, string[]>> = {
  "user-ana": {
    "sopaipillas": ["sop-m1-s1", "sop-m1-s2"],
    "suculentas": ["suc-m1-s1"],
  },
  "user-carlos": {
    "sopaipillas": ["sop-m1-s1"],
  },
};

export async function getDemoUserByEmail(email: string): Promise<DemoUser | null> {
  if (isKvConfigured && kvClient) {
    try {
      const user = await kvClient.get<DemoUser>(`lms:user:email:${email.toLowerCase()}`);
      if (user) return user;
    } catch (e) {
      console.error("Error reading user by email from Vercel KV:", e);
    }
  }
  return demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  ) ?? null;
}

export async function getDemoUserById(userId: string): Promise<DemoUser | null> {
  if (isKvConfigured && kvClient) {
    try {
      const user = await kvClient.get<DemoUser>(`lms:user:id:${userId}`);
      if (user) return user;
    } catch (e) {
      console.error("Error reading user by id from Vercel KV:", e);
    }
  }
  return demoUsers.find((user) => user.id === userId) ?? null;
}

export async function saveDbUser(user: DemoUser): Promise<void> {
  if (isKvConfigured && kvClient) {
    try {
      await kvClient.set(`lms:user:id:${user.id}`, user);
      await kvClient.set(`lms:user:email:${user.email.toLowerCase()}`, user);
      
      const list = await kvClient.get<DemoUser[]>("lms:users:list") || [];
      const index = list.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        list[index] = user;
      } else {
        list.push(user);
      }
      await kvClient.set("lms:users:list", list);
    } catch (e) {
      console.error("Error saving user to Vercel KV:", e);
    }
  }
}

export async function getAllUsers(): Promise<DemoUser[]> {
  let dynamicUsers: DemoUser[] = [];
  if (isKvConfigured && kvClient) {
    try {
      const list = await kvClient.get<DemoUser[]>("lms:users:list");
      if (list && Array.isArray(list)) {
        dynamicUsers = list;
      }
    } catch (e) {
      console.error("Error reading users list from KV:", e);
    }
  }
  
  const all = [...demoUsers];
  for (const user of dynamicUsers) {
    if (!all.some((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase())) {
      all.push(user);
    }
  }
  return all;
}

export function getCourseById(courseId: string) {
  return demoCourses.find((course) => course.id === courseId);
}

export function flattenCourseSections(course: Course) {
  return course.modules.flatMap((module) => module.sections);
}

export async function getUserCompletedSectionIds(userId: string, courseId: string): Promise<string[]> {
  if (isKvConfigured && kvClient) {
    try {
      const progress = await kvClient.get<string[]>(`lms:progress:${userId}:${courseId}`);
      return progress ?? [];
    } catch (e) {
      console.error("Error reading from Vercel KV:", e);
    }
  }
  return localProgress[userId]?.[courseId] ?? [];
}

export async function saveSectionProgress(userId: string, courseId: string, sectionId: string): Promise<string[]> {
  const current = await getUserCompletedSectionIds(userId, courseId);
  const updated = current.includes(sectionId) ? current : [...current, sectionId];
  
  if (isKvConfigured && kvClient) {
    try {
      await kvClient.set(`lms:progress:${userId}:${courseId}`, updated);
    } catch (e) {
      console.error("Error writing to Vercel KV:", e);
    }
  } else {
    if (!localProgress[userId]) {
      localProgress[userId] = {};
    }
    localProgress[userId][courseId] = updated;
  }
  return updated;
}

export async function getDashboardCourses(userId: string): Promise<DashboardCourse[]> {
  const user = await getDemoUserById(userId);

  if (!user) {
    return [];
  }

  const coursePromises = user.enrolledCourseIds.map(async (courseId) => {
    const course = getCourseById(courseId);

    if (!course) {
      return null;
    }

    const sections = flattenCourseSections(course);
    const completedSections = await getUserCompletedSectionIds(userId, course.id);
    const completedCount = completedSections.length;
    const totalSections = sections.length;
    const progressPercent =
      totalSections === 0
        ? 0
        : Math.round((completedCount / totalSections) * 100);
    const nextSectionTitle =
      sections.find((section) => !completedSections.includes(section.id))
        ?.title ?? null;

    return {
      ...course,
      completedSections: completedCount,
      totalSections,
      progressPercent,
      nextSectionTitle,
    };
  });

  const resolved = await Promise.all(coursePromises);
  return resolved.filter((course): course is DashboardCourse => course !== null);
}

export async function getCourseProgressSummary(userId: string, courseId: string) {
  const course = getCourseById(courseId);

  if (!course) {
    return null;
  }

  const completedSectionIds = await getUserCompletedSectionIds(userId, courseId);
  const sections = flattenCourseSections(course);
  const progressPercent =
    sections.length === 0
      ? 0
      : Math.round((completedSectionIds.length / sections.length) * 100);

  return {
    course,
    sections,
    completedSectionIds,
    progressPercent,
  };
}

export async function resetUserProgress(userId: string, courseId: string): Promise<void> {
  if (isKvConfigured && kvClient) {
    try {
      await kvClient.del(`lms:progress:${userId}:${courseId}`);
    } catch (e) {
      console.error("Error deleting progress key from Vercel KV:", e);
      throw e;
    }
  } else {
    if (localProgress[userId]) {
      delete localProgress[userId][courseId];
    }
  }
}
