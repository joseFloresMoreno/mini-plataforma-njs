import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { SESSION_COOKIE, getSessionUser, getCookieValue } from "@/lib/auth";
import { getDashboardCourses } from "@/lib/lms-data";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  let token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    const reqHeaders = await headers();
    token = getCookieValue(reqHeaders.get("cookie"), SESSION_COOKIE);
  }
  const sessionUser = await getSessionUser(token);

  if (!sessionUser) {
    redirect("/login");
  }

  const courses = await getDashboardCourses(sessionUser.id);
  const totalProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce((sum, course) => sum + course.progressPercent, 0) /
            courses.length,
        );
  const totalCompletedSections = courses.reduce(
    (sum, course) => sum + course.completedSections,
    0,
  );
  const currentCourse = courses[0];
  const nextLesson = currentCourse?.nextSectionTitle ?? "Sin curso asignado";

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle={`Bienvenida, ${sessionUser.name}`}
        actions={[
          { href: "/", label: "Inicio" },
          { href: "/api/auth/logout", label: "Cerrar sesión" },
        ]}
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <section className="mx-auto w-full max-w-7xl space-y-8">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
                  Mis cursos y actividad
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
                  Hola, {sessionUser.name}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                  Esta es tu vista principal: cursos matriculados, resumen de interacciones y acceso directo a lo último que dejaste pendiente.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Progreso promedio</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">{totalProgress}%</p>
                </div>
                <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Secciones completadas</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">{totalCompletedSections}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-[color:var(--border)] bg-blue-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-600">Cursos activos</p>
                <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">{courses.length}</p>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Siguiente actividad</p>
                <p className="mt-2 text-base font-semibold text-[color:var(--foreground)]">{nextLesson}</p>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sesión</p>
                <p className="mt-2 text-3xl font-semibold text-green-600">Activa</p>
              </div>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
                    Tus cursos
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">Retoma donde lo dejaste</h2>
                </div>
              </div>

              {courses.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-8 text-slate-500">
                  No tienes cursos asignados todavía.
                </div>
              )}
            </div>

            <aside className="space-y-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
                Interacciones recientes
              </p>
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-4 text-sm">
                  <p className="font-semibold text-[color:var(--foreground)]">{course.title}</p>
                  <p className="mt-1 text-slate-500">
                    {course.completedSections} de {course.totalSections} secciones completadas
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </aside>
          </section>
        </section>
      </main>
    </div>
  );
}
