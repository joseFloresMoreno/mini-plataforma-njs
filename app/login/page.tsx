import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectCandidate = resolvedSearchParams.redirect ?? "/dashboard";
  const redirectTo = redirectCandidate.startsWith("/")
    ? redirectCandidate
    : "/dashboard";

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle="Acceso al sistema"
        actions={[{ href: "/", label: "Inicio" }]}
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
              Acceso al LMS
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              Inicia sesión para ver tus cursos, tu avance y la siguiente actividad.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Sesión con JWT en cookie HTTP-only y rutas privadas protegidas por middleware.
            </p>

            <LoginForm redirectTo={redirectTo} />
          </section>

          <aside className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
              Qué verás después
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                Primero aterrizas en tu dashboard de cursos con resumen de interacciones.
              </p>
              <p>
                Cada curso abre un visor con sidebar tipo TODO y navegación al final del contenido.
              </p>
              <p>
                El switch superior te deja alternar al modo oscuro sin perder la sesión.
              </p>
            </div>
            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
              Tip: usa la cuenta de demo para entrar rápido y revisar el flujo completo.
            </div>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--surface-soft)]"
            >
              Ir al dashboard
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
