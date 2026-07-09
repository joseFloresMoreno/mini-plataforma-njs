"use client";

import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/lib/lms-data";
import { flattenCourseSections } from "@/lib/lms-data";
import { CourseQuiz } from "./course-quiz";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AIChatbox } from "./ai-chatbox";
import { DynamicVideo } from "./dynamic-video";

type CourseViewerProps = {
  course: Course;
  userId: string;
  initialCompletedSectionIds: string[];
  initialActiveSectionId: string;
};

export function CourseViewer({
  course,
  userId,
  initialCompletedSectionIds,
  initialActiveSectionId,
}: CourseViewerProps) {
  const router = useRouter();
  const sections = useMemo(() => flattenCourseSections(course), [course]);
  const storageKey = `lms-progress:${course.id}`;
  const [completedSectionIds, setCompletedSectionIds] = useState(initialCompletedSectionIds);
  const [activeSectionId, setActiveSectionId] = useState(initialActiveSectionId);

  const activeSectionIndex = sections.findIndex(
    (section) => section.id === activeSectionId,
  );
  const activeSection = sections[activeSectionIndex] ?? sections[0];
  const isSectionCompleted = completedSectionIds.includes(activeSection.id);
  
  const activeSectionHasQuiz = !!activeSection.quiz && activeSection.quiz.length > 0;
  const [quizPassed, setQuizPassed] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("lms_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setIsAdmin(parsed.role === "admin");
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSectionId]);

  const handleResetProgress = async () => {
    if (!window.confirm("¿Seguro que deseas reiniciar el progreso de este curso para TODOS los alumnos en el sistema?")) {
      return;
    }
    setIsResetting(true);
    try {
      const storedUser = localStorage.getItem("lms_user");
      if (!storedUser) return;
      const parsed = JSON.parse(storedUser);
      
      const res = await fetch("/api/reset-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "all",
          courseId: course.id,
          adminId: parsed.id,
        }),
      });

      if (res.ok) {
        setCompletedSectionIds([]);
        setActiveSectionId(sections[0]?.id || "");
        alert("Progreso reiniciado correctamente.");
        router.refresh();
      } else {
        alert("Error al reiniciar progreso.");
      }
    } catch {
      alert("Error de conexión.");
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    setQuizPassed(isSectionCompleted);
  }, [activeSectionId, isSectionCompleted]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(completedSectionIds),
      );
    } catch {
      // Ignore persistence failures in non-browser contexts.
    }
  }, [completedSectionIds, storageKey]);

  const completedPercent =
    sections.length === 0
      ? 0
      : Math.round((completedSectionIds.length / sections.length) * 100);

  const isSectionUnlocked = (index: number) => {
    if (index === 0) {
      return true;
    }

    return completedSectionIds.includes(sections[index - 1]?.id ?? "");
  };

  const markCurrentAsComplete = async () => {
    setCompletedSectionIds((current) =>
      current.includes(activeSection.id)
        ? current
        : [...current, activeSection.id],
    );

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId: course.id,
          sectionId: activeSection.id,
        }),
      });
    } catch (e) {
      console.error("Failed to save progress to server:", e);
    }
  };

  const isLastSection = activeSectionIndex === sections.length - 1;
  const isNextDisabled = activeSectionHasQuiz && !quizPassed;

  const handleNextClick = async () => {
    if (isNextDisabled) return;

    if (isLastSection) {
      await markCurrentAsComplete();
      router.push("/dashboard");
      router.refresh();
    } else {
      if (!isSectionCompleted) {
        await markCurrentAsComplete();
      }
      const nextSection = sections[activeSectionIndex + 1];
      setActiveSectionId(nextSection.id);
    }
  };

  const goToPreviousSection = () => {
    if (activeSectionIndex > 0) {
      const previousSection = sections[activeSectionIndex - 1];
      setActiveSectionId(previousSection.id);
    }
  };

  const currentModule = course.modules.find((module) =>
    module.sections.some((section) => section.id === activeSection.id),
  );

  const remainingSections = sections.filter(
    (section) => !completedSectionIds.includes(section.id),
  ).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
      <aside className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-5 shadow-sm xl:sticky xl:top-24 xl:self-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
            Contenido del curso
          </p>
          <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">{course.title}</h2>
          <p className="text-sm text-slate-500">{remainingSections} pendientes · {completedPercent}% completado</p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${completedPercent}%` }} />
        </div>

        <div className="mt-5 space-y-5">
          {course.modules.map((module) => (
            <div key={module.id} className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-[color:var(--foreground)]">{module.title}</p>
                <p className="text-xs text-slate-500">{module.description}</p>
              </div>
              <div className="space-y-2 pl-1">
                {module.sections.map((section) => {
                  const sectionIndex = sections.findIndex((candidate) => candidate.id === section.id);
                  const locked = !isSectionUnlocked(sectionIndex) && activeSection.id !== section.id;
                  const active = activeSection.id === section.id;
                  const completed = completedSectionIds.includes(section.id);

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => {
                        if (!locked) {
                          setActiveSectionId(section.id);
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left text-sm transition ${
                        active
                          ? "border-blue-600 bg-blue-600 !text-white font-medium"
                          : locked
                            ? "border-dashed border-[color:var(--border)] bg-[var(--surface-soft)] text-slate-400"
                            : "border-[color:var(--border)] bg-[var(--surface)] text-[color:var(--foreground)] hover:border-blue-200 hover:bg-[var(--surface-soft)]"
                      }`}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <span
                          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                            completed
                              ? "border-green-200 bg-green-50 text-green-700"
                              : active
                                ? "border-white bg-white text-blue-600"
                                  : "border-[color:var(--border)] bg-[var(--surface)] text-slate-400"
                          }`}
                        >
                          {completed ? "✓" : active ? "•" : ""}
                        </span>
                        <span className="min-w-0 truncate">{section.title}</span>
                      </span>
                      <span className="ml-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                        {locked ? "Bloqueado" : completed ? "Hecho" : active ? "Actual" : "TODO"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-[color:var(--border)]">
              <button
                type="button"
                onClick={handleResetProgress}
                disabled={isResetting}
                className="inline-flex h-10 w-full items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:border-red-300 disabled:opacity-50"
              >
                {isResetting ? "Reiniciando..." : "Reiniciar Curso (Todos)"}
              </button>
            </div>
          )}
        </div>
      </aside>

      <section className="space-y-6 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6 lg:p-8">
        {completedPercent === 100 && (
          <div className="rounded-3xl border border-green-200 bg-green-50 p-5 dark:bg-green-950/20 dark:border-green-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <span className="text-2xl mt-0.5">🎉</span>
              <div className="text-left">
                <h4 className="font-semibold text-green-900 dark:text-green-400">¡Felicitaciones! Has completado el curso</h4>
                <p className="text-xs text-green-700 dark:text-green-300/80 mt-0.5">Ya tienes acceso a tu certificado digital oficial de finalización.</p>
              </div>
            </div>
            <Link
              href={`/courses/${course.id}/certificate`}
              className="inline-flex h-9 items-center justify-center rounded-full bg-green-600 px-5 text-xs font-semibold !text-white transition hover:bg-green-500 shrink-0 text-center"
            >
              🎓 Obtener certificado
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
              {currentModule?.title}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">{activeSection.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{activeSection.summary}</p>
          </div>
          <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Estado</p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">
              {isSectionCompleted ? "Completada" : "En progreso"}
            </p>
          </div>
        </div>

        <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="max-w-none space-y-6 text-[15px] leading-8 text-[color:var(--foreground)]">
            {activeSection.videoUrl && (
              <div className="mb-4 overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-sm">
                <DynamicVideo url={activeSection.videoUrl} />
              </div>
            )}
            <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--content-bg)] p-5">
              <div
                className="prose prose-slate max-w-none prose-p:leading-8 prose-li:leading-8"
                dangerouslySetInnerHTML={{ __html: activeSection.html }}
              />
            </div>


            {activeSectionHasQuiz && activeSection.quiz && (
              <CourseQuiz
                questions={activeSection.quiz}
                onPass={() => setQuizPassed(true)}
              />
            )}
          </div>

          <div className="mt-8 border-t border-[color:var(--border)] pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={goToPreviousSection}
                disabled={activeSectionIndex <= 0}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleNextClick}
                disabled={isNextDisabled}
                className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold !text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  isLastSection 
                    ? "bg-green-600 hover:bg-green-500" 
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {isLastSection 
                  ? "Finalizar y cerrar el curso" 
                  : isSectionCompleted 
                    ? "Siguiente" 
                    : "Marcar completada y seguir"}
              </button>
            </div>
          </div>
        </article>
      </section>
      <AIChatbox courseId={course.id} courseTitle={course.title} />
    </div>
  );
}
