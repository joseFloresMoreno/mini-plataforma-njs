import { useState } from "react";
import Link from "next/link";
import type { DashboardCourse } from "@/lib/lms-data";

type CourseCardProps = {
  course: DashboardCourse & { isEnrolled?: boolean };
  userId: string;
  onEnrollSuccess?: () => void;
};

export function CourseCard({ course, userId, onEnrollSuccess }: CourseCardProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId: course.id }),
      });
      if (res.ok) {
        onEnrollSuccess?.();
      } else {
        alert("Ocurrió un error al matricularse.");
      }
    } catch {
      alert("Error de conexión.");
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <article className="group flex h-full flex-col rounded-[1.6rem] border border-[color:var(--border)] bg-[var(--surface)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${course.accent}`} />
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
            {course.level}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">{course.title}</h3>
        </div>
        {course.isEnrolled && (
          <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-right">
            <p className="text-lg font-semibold text-[color:var(--foreground)]">{course.progressPercent}%</p>
            <p className="text-xs text-slate-500">progreso</p>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{course.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-[color:var(--foreground)]">
        <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface)] p-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Módulos</p>
          <p className="mt-1 text-base font-semibold text-[color:var(--foreground)]">{course.modules.length}</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface)] p-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Secciones</p>
          <p className="mt-1 text-base font-semibold text-[color:var(--foreground)]">{course.totalSections}</p>
        </div>
      </div>
      {course.isEnrolled && (
        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>{course.duration}</span>
          <span>{course.completedSections} completadas</span>
        </div>
      )}
      {course.isEnrolled && (
        <div className="mt-5 space-y-3">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-slate-500">
            {course.nextSectionTitle
              ? `Siguiente tema: ${course.nextSectionTitle}`
              : "Curso completado"}
          </p>
        </div>
      )}
      <div className="mt-6 mt-auto">
        {course.isEnrolled ? (
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-blue-600 px-4 text-sm font-semibold !text-white transition hover:bg-blue-500"
          >
            Abrir curso
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-green-600 px-4 text-sm font-semibold !text-white transition hover:bg-green-500 disabled:opacity-50"
          >
            {isEnrolling ? "Matriculando..." : "Matricularse gratis"}
          </button>
        )}
      </div>
    </article>
  );
}
