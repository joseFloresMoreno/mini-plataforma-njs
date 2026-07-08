import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CourseViewer } from "@/components/course-viewer";
import { SiteHeader } from "@/components/site-header";
import { SESSION_COOKIE, getSessionUser } from "@/lib/auth";
import { getCourseById, getCourseProgressSummary, getDemoUserById } from "@/lib/lms-data";

type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const cookieStore = await cookies();
  const sessionUser = await getSessionUser(cookieStore.get(SESSION_COOKIE)?.value);

  if (!sessionUser) {
    redirect("/login");
  }

  const user = getDemoUserById(sessionUser.id);

  if (!user || !user.enrolledCourseIds.includes(courseId)) {
    redirect("/dashboard");
  }

  const summary = await getCourseProgressSummary(user.id, courseId);

  if (!summary) {
    notFound();
  }

  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  const initialActiveSection =
    summary.sections.find(
      (section) => !summary.completedSectionIds.includes(section.id),
    ) ?? summary.sections[summary.sections.length - 1];

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle={course.title}
        actions={[
          { href: "/dashboard", label: "← Volver a cursos" },
          { href: "/api/auth/logout", label: "Cerrar sesión" },
        ]}
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <section className="mx-auto w-full max-w-7xl space-y-6">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
              Visor de curso
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
                  {course.title}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                  {course.overview}
                </p>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] px-5 py-4 text-sm text-[color:var(--foreground)]">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Progreso actual</p>
                <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">{summary.progressPercent}%</p>
              </div>
            </div>
          </div>

          <CourseViewer
            course={course}
            userId={user.id}
            initialCompletedSectionIds={summary.completedSectionIds}
            initialActiveSectionId={initialActiveSection.id}
          />
        </section>
      </main>
    </div>
  );
}
