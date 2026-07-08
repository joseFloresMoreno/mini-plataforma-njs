import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { demoCourses } from "@/lib/lms-data";

export default function Home() {
  const totalModules = demoCourses.reduce(
    (count, course) => count + course.modules.length,
    0,
  );

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle="Plataforma de Cursos Libres"
        actions={[
          { href: "/login", label: "Iniciar Sesión", variant: "primary" },
          { href: "/register", label: "Registrarse" },
        ]}
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <section className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6 rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                LMS Pro
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
                  Aprende a tu propio ritmo con cursos libres e interactivos.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Visualiza tu progreso, completa lecciones estructuradas paso a paso y realiza las evaluaciones correspondientes para certificar tus conocimientos.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold !text-white transition hover:bg-blue-500"
                >
                  Registrarse gratis
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--surface-soft)]"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-8">
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <p className="text-3xl font-semibold text-[color:var(--foreground)]">{demoCourses.length}</p>
                <p className="mt-2 text-sm text-slate-500">Cursos disponibles</p>
              </div>
              <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] p-5">
                <p className="text-3xl font-semibold text-[color:var(--foreground)]">{totalModules}</p>
                <p className="mt-2 text-sm text-slate-500">Módulos de aprendizaje</p>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
                Características
              </p>
              <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
                <p>
                  <strong>Matrícula Libre</strong>: Explora todo el catálogo de cursos y matúlate en los que te interesen con un solo clic.
                </p>
                <p>
                  <strong>Seguimiento de Progreso</strong>: Tu avance se guarda de forma segura en la base de datos para que retomes donde lo dejaste.
                </p>
                <p>
                  <strong>Evaluaciones Integradas</strong>: Pon a prueba lo aprendido al finalizar cada lección importante.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm leading-7 text-blue-800 mt-6">
              Nuestra plataforma está optimizada para cargarse de forma instantánea en cualquier dispositivo móvil o de escritorio.
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
