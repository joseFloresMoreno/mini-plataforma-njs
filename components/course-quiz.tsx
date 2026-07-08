"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/lms-data";

type CourseQuizProps = {
  questions: QuizQuestion[];
  onPass: () => void;
};

export function CourseQuiz({ questions, onPass }: CourseQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (isPassed) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setSubmitted(false);
  };

  const handleValidate = () => {
    // Check if all questions are answered
    const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);
    if (!allAnswered) {
      alert("Por favor responde todas las preguntas antes de validar.");
      return;
    }

    // Check if all answers are correct
    const allCorrect = questions.every(
      (q) => selectedAnswers[q.id] === q.correctOptionIndex,
    );

    setSubmitted(true);
    if (allCorrect) {
      setIsPassed(true);
      onPass();
    } else {
      setIsPassed(false);
    }
  };

  return (
    <div className="mt-8 rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-6 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Evaluación del curso</p>
        <h3 className="text-xl font-bold text-[color:var(--foreground)] mt-1">Cuestionario Final</h3>
        <p className="text-sm text-slate-500 mt-1">
          Responde correctamente todas las preguntas para desbloquear la finalización y certificación del curso.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-3">
            <p className="font-semibold text-sm text-[color:var(--foreground)]">
              {idx + 1}. {q.question}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[q.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelect(q.id, optIdx)}
                    className={`px-4 py-3 text-left text-sm rounded-2xl border transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
                        : "border-[color:var(--border)] bg-[var(--surface)] text-[color:var(--foreground)] hover:border-slate-300 hover:bg-[var(--surface-soft)]"
                    }`}
                    disabled={isPassed}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[color:var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {submitted && !isPassed && (
            <p className="text-sm font-medium text-red-600">
              ❌ Algunas respuestas son incorrectas. ¡Vuelve a revisarlas!
            </p>
          )}
          {isPassed && (
            <p className="text-sm font-medium text-green-600">
              🎉 ¡Cuestionario aprobado con éxito! Ya puedes finalizar el curso.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleValidate}
          disabled={isPassed}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition ${
            isPassed
              ? "bg-green-600 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {isPassed ? "Aprobado" : "Validar Respuestas"}
        </button>
      </div>
    </div>
  );
}
