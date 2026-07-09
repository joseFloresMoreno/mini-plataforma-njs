"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

type AIChatboxProps = {
  courseId: string;
  courseTitle: string;
};

function getMessageText(m: any): string {
  if (Array.isArray(m.parts)) {
    return m.parts
      .map((part: any) => {
        if (part.type === "text") {
          return part.text;
        }
        return "";
      })
      .join("");
  }
  return m.content || "";
}

export function AIChatbox({ courseId, courseTitle }: AIChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { courseId },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when new messages stream in
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] shadow-2xl backdrop-blur-xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-blue-600 px-5 py-4 text-white">
            <div>
              <h3 className="text-sm font-semibold">Tutor IA: {courseTitle}</h3>
              <p className="text-xs text-blue-100 mt-0.5">Preguntas sobre este curso</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 hover:bg-blue-700 transition"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xl font-bold">
                  🤖
                </div>
                <h4 className="text-sm font-semibold text-[color:var(--foreground)]">¿Tienes alguna duda?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hola, soy tu tutor de IA. Pregúntame sobre cualquier lección, receta o ingrediente de este curso. ¡Te responderé de inmediato!
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isUser = m.role === "user";
                const messageText = getMessageText(m);
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-[1.25rem] px-4 py-2.5 text-sm leading-6 shadow-sm ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-[var(--surface-soft)] text-[color:var(--foreground)] border border-[color:var(--border)] rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{messageText}</p>
                    </div>
                  </div>
                );
              })
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-[1.25rem] rounded-bl-none bg-[var(--surface-soft)] border border-[color:var(--border)] px-4 py-2.5 text-sm text-slate-500 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  </div>
                  <span>Pensando...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 text-center">
                Hubo un error de conexión o no has configurado tu GOOGLE_GENERATIVE_AI_API_KEY.
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-[color:var(--border)] p-3 bg-[var(--surface-soft)] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Pregunta sobre ${courseTitle}...`}
              className="flex-1 rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[color:var(--foreground)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600"
              aria-label="Enviar"
            >
              ▲
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl active:translate-y-0"
        aria-label="Abrir asistente de IA"
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>
    </div>
  );
}
