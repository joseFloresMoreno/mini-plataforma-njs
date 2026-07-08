import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle="Crear nueva cuenta"
        actions={[{ href: "/login", label: "Iniciar sesión" }]}
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
              Registro LMS
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              Crea tu cuenta de alumno para iniciar tu aprendizaje.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Ingresa tus datos para registrarte. El registro es gratuito e instantáneo.
            </p>

            <RegisterForm />
          </section>

          <aside className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
                Beneficios de registrarte
              </p>
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  <strong>Acceso Libre</strong>: Podrás explorar y matricularte en cualquiera de los cursos disponibles.
                </p>
                <p>
                  <strong>Progreso Continuo</strong>: Guardaremos tu avance lección por lección en la base de datos de forma segura.
                </p>
                <p>
                  <strong>Evaluación y Certificados</strong>: Realiza los cuestionarios finales y finaliza tus cursos.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-800">
              ¿Ya tienes cuenta? Usa el botón superior para ingresar directamente con tus datos de acceso.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
