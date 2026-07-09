"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";
import { AdminDashboard } from "@/components/admin-dashboard";
import type { DashboardCourse } from "@/lib/lms-data";

type DashboardData = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  courses: DashboardCourse[];
  allCourses: (DashboardCourse & { isEnrolled: boolean })[];
  totalProgress: number;
  totalCompletedSections: number;
  nextLesson: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchDashboardData = (userId: string) => {
    fetch(`/api/dashboard-data?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("lms_user");
      if (!storedUser) {
        router.replace("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      fetchDashboardData(parsedUser.id);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500 font-semibold">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const { user, courses, totalProgress, totalCompletedSections, nextLesson } = data;

  if (user.role === "admin") {
    return (
      <div>
        <SiteHeader
          brand="Mini-Plataforma"
          subtitle={`Panel de Administración: ${user.name}`}
          actions={[
            { href: "/", label: "Inicio" },
            { href: "/api/auth/logout", label: "Cerrar sesión" },
          ]}
        />
        <main className="px-6 py-8 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <AdminDashboard adminId={user.id} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle={`Bienvenida, ${user.name}`}
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
                  Hola, {user.name}
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
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
                  Mis Cursos Matriculados
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">Mis Cursos</h2>
              </div>

              {courses.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      userId={user.id}
                      onEnrollSuccess={() => fetchDashboardData(user.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-[color:var(--border)] bg-[var(--surface)] p-8 text-center text-slate-500">
                  <p className="font-semibold">Aún no te has matriculado en ningún curso.</p>
                  <p className="text-sm mt-1">Explora la pestaña "Cursos" arriba para comenzar.</p>
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
