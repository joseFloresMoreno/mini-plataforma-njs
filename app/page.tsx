import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { demoCourses, demoUsers } from "@/lib/lms-data";

export default function Home() {
  const totalModules = demoCourses.reduce(
    (count, course) => count + course.modules.length,
    0,
  );

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle="Plataforma LMS en Next.js"
        actions={[
          { href: "/login", label: "Entrar", variant: "primary" },
          { href: "/dashboard", label: "Mis cursos" },
        ]}
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <section className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Plataforma de Cursos
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
                Una base LMS clara, ligera y enfocada en cursos, progreso y continuidad.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Visualiza tu progreso, completa lecciones estructuradas paso a paso y realiza las evaluaciones correspondientes para certificar tus conocimientos.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold !text-white transition hover:bg-blue-500"
              >
                Ir al login
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--surface-soft)]"
              >
                Ver cursos
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <p className="text-3xl font-semibold text-[color:var(--foreground)]">{demoCourses.length}</p>
                <p className="mt-2 text-sm text-slate-500">Cursos de demo</p>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <p className="text-3xl font-semibold text-[color:var(--foreground)]">{totalModules}</p>
                <p className="mt-2 text-sm text-slate-500">Módulos iniciales</p>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <p className="text-3xl font-semibold text-[color:var(--foreground)]">{demoUsers.length}</p>
                <p className="mt-2 text-sm text-slate-500">Usuarios listos</p>
              </div>
            </div>
          </div>

          <aside className="space-y-4 rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
              Flujo del alumno
            </p>
            <div className="space-y-3">
              {[
                "Bienvenida y login",
                "Dashboard con cursos e interacciones",
                "Visor de curso con TODO lateral",
                "Contenido largo con navegación abajo",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-soft)] px-4 py-4 text-sm font-medium text-[color:var(--foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-800">
              Aprende de forma interactiva con evaluaciones integradas en cada curso y realiza un seguimiento automático de tu progreso.
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
