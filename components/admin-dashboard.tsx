"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EnrolledCourse = {
  courseId: string;
  courseTitle: string;
  progressPercent: number;
  completedSections: number;
  totalSections: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  enrolledCourses: EnrolledCourse[];
  averageProgress: number;
};

type AdminDashboardProps = {
  adminId: string;
};

export function AdminDashboard({ adminId }: AdminDashboardProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isResetting, setIsResetting] = useState<string | null>(null); // courseId

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?adminId=${adminId}`);
      if (!res.ok) throw new Error("No se pudieron cargar los usuarios.");
      const data = await res.json();
      setUsers(data.users || []);
      
      // Update selected user reference if active
      if (selectedUser) {
        const updated = data.users.find((u: AdminUser) => u.id === selectedUser.id);
        if (updated) setSelectedUser(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []))
      .catch(() => {});
  }, [adminId]);

  const handleResetUserCourse = async (userId: string, courseId: string) => {
    if (!window.confirm("¿Seguro que deseas reiniciar el progreso de este curso para este alumno?")) {
      return;
    }
    setIsResetting(courseId);
    try {
      const res = await fetch("/api/reset-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, adminId }),
      });
      if (res.ok) {
        alert("Progreso del alumno reiniciado.");
        await fetchUsers();
      } else {
        alert("Error al reiniciar progreso.");
      }
    } catch {
      alert("Error de conexión.");
    } finally {
      setIsResetting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500 font-semibold">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {/* Users Table List */}
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
            Control de Alumnos
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">Lista de Usuarios</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-[color:var(--foreground)]">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-slate-500 font-semibold">
                <th className="pb-3 pr-4">Nombre / Email</th>
                <th className="pb-3 pr-4">Rol</th>
                <th className="pb-3 pr-4 text-center">Cursos</th>
                <th className="pb-3 pr-4 text-right">Progreso Promedio</th>
                <th className="pb-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={`hover:bg-[var(--surface-soft)] transition-colors ${
                    selectedUser?.id === u.id ? "bg-blue-50/50" : ""
                  }`}
                >
                  <td className="py-4 pr-4">
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {u.role === "admin" ? "Admin" : "Alumno"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-center font-medium">
                    {u.enrolledCourses.length}
                  </td>
                  <td className="py-4 pr-4 text-right font-semibold">
                    {u.averageProgress}%
                  </td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      className="inline-flex h-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-xs font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--surface-soft)]"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* User Details & Individual Course Reset */}
      <aside className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 flex flex-col justify-between self-start lg:sticky lg:top-24">
        {selectedUser ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">
                Detalle del Alumno
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
                {selectedUser.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{selectedUser.email}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Cursos Matriculados
              </h4>
              {selectedUser.enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.enrolledCourses.map((c) => (
                    <div
                      key={c.courseId}
                      className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm">{c.courseTitle}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {c.completedSections} de {c.totalSections} secciones
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleResetUserCourse(selectedUser.id, c.courseId)}
                          disabled={isResetting === c.courseId}
                          className="inline-flex h-8 items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:border-red-300 disabled:opacity-50"
                        >
                          {isResetting === c.courseId ? "Reseteando..." : "Reset"}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-slate-500">Progreso</span>
                          <span>{c.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${c.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No está matriculado en ningún curso.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center text-center p-6 border border-dashed border-[color:var(--border)] rounded-2xl">
            <p className="text-sm font-semibold text-slate-500">Selecciona un alumno</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Haz clic en "Ver detalle" en la tabla para gestionar su progreso lección por lección.
            </p>
          </div>
        )}
      </aside>
    </div>

    {/* Admin Courses Listing Section */}
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--surface)] p-6 shadow-sm sm:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
          Vista de Administrador
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">Cursos en la Plataforma</h2>
        <p className="text-slate-500 text-xs mt-1">Como administrador, puedes revisar cualquier curso o reiniciar su avance global para todos los alumnos del sistema.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-5 space-y-4 flex flex-col justify-between"
          >
            <div>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                {course.level}
              </span>
              <h3 className="text-lg font-semibold mt-2 text-[color:var(--foreground)]">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {course.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[color:var(--border)]">
              <Link
                href={`/courses/${course.id}`}
                className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-4 text-xs font-semibold !text-white transition hover:bg-blue-500"
              >
                Revisar Lecciones
              </Link>
              
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm(`¿Seguro que deseas reiniciar el progreso de "${course.title}" para TODOS los alumnos?`)) {
                    try {
                      const res = await fetch("/api/reset-progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: "all", courseId: course.id, adminId }),
                      });
                      if (res.ok) {
                        alert(`Progreso global de "${course.title}" reiniciado con éxito.`);
                        fetchUsers();
                      } else {
                        alert("Error al reiniciar progreso global.");
                      }
                    } catch {
                      alert("Error de red.");
                    }
                  }
                }}
                className="inline-flex h-9 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                Reset Global
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);
}
