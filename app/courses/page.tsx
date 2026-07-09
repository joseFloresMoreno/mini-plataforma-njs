"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { demoCourses } from "@/lib/lms-data";
import Link from "next/link";

type UserState = {
  id: string;
  name: string;
  email: string;
  role: string;
  enrolledCourseIds: string[];
};

export default function CoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null); // courseId

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lms_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      // Redirect to login with enroll course query parameter
      router.push(`/login?enrollCourseId=${courseId}`);
      return;
    }

    setEnrolling(courseId);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, courseId }),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload?.user) {
          // Sync new user state in localStorage
          localStorage.setItem("lms_user", JSON.stringify(payload.user));
          setUser(payload.user);
        }
        alert("¡Matrícula exitosa! Serás redirigido a tu dashboard.");
        router.push("/dashboard");
      } else {
        alert("Error al matricularse. Por favor intenta de nuevo.");
      }
    } catch {
      alert("Error de red.");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle={user ? `Catálogo de Cursos • Hola, ${user.name}` : "Catálogo de Cursos Libres"}
        actions={
          user
            ? [
                { href: "/dashboard", label: "Dashboard" },
                { href: "/api/auth/logout", label: "Cerrar sesión" },
              ]
            : [
                { href: "/login", label: "Iniciar Sesión", variant: "primary" },
                { href: "/register", label: "Registrarse" },
              ]
        }
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <section className="mx-auto w-full max-w-7xl space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
              Catálogo de Cursos
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              Cursos Disponibles
            </h1>
            <p className="mt-3 text-slate-500 max-w-2xl text-sm">
              Inscríbete libremente en cualquiera de nuestros cursos interactivos. Desarrolla habilidades prácticas, haz un seguimiento de tu avance y pon a prueba tus conocimientos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {demoCourses.map((course) => {
              const isEnrolled = user?.enrolledCourseIds.includes(course.id) || false;
              const isAdmin = user?.role === "admin" || false;

              return (
                <div
                  key={course.id}
                  className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-blue-700">
                      {course.level}
                    </span>
                    <h2 className="text-2xl font-semibold text-[color:var(--foreground)]">
                      {course.title}
                    </h2>
                    <p className="text-sm leading-6 text-slate-600">
                      {course.description}
                    </p>
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                      <span>⏱️ {course.duration}</span>
                      <span>👨‍🏫 {course.instructor}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[color:var(--border)] flex items-center justify-between gap-4">
                    {isAdmin ? (
                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-purple-600 px-6 text-sm font-semibold !text-white transition hover:bg-purple-500"
                      >
                        Ver Curso (Admin)
                      </Link>
                    ) : isEnrolled ? (
                      <Link
                        href={`/courses/${course.id}`}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold !text-white transition hover:bg-blue-500"
                      >
                        Ir al Curso
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrolling === course.id}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-blue-600 bg-white text-blue-600 px-6 text-sm font-semibold transition hover:bg-blue-50 disabled:opacity-50"
                      >
                        {enrolling === course.id ? "Matriculando..." : "Matricularse"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
