import Link from "next/link";
import type { DashboardCourse } from "@/lib/lms-data";

type CourseCardProps = {
  course: DashboardCourse;
};

export function CourseCard({ course }: CourseCardProps) {
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
        <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-right">
          <p className="text-lg font-semibold text-[color:var(--foreground)]">{course.progressPercent}%</p>
          <p className="text-xs text-slate-500">progreso</p>
        </div>
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
      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
        <span>{course.duration}</span>
        <span>{course.completedSections} completadas</span>
      </div>
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
      <div className="mt-6">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-blue-600 px-4 text-sm font-semibold !text-white transition hover:bg-blue-500"
        >
          Abrir curso
        </Link>
      </div>
    </article>
  );
}
