"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type RegisterState = {
  name: string;
  email: string;
  password: string;
};

const initialState: RegisterState = {
  name: "",
  email: "",
  password: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollCourseId, setEnrollCourseId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem("lms_user");
    } catch {
      // Ignore
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const enrollId = params.get("enrollCourseId");
      if (enrollId) {
        setEnrollCourseId(enrollId);
      }
    }
  }, []);

  const submitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Todos los campos son obligatorios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; token?: string; user?: any }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "No se pudo crear la cuenta.");
      }

      if (payload?.token) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `lms_session=${payload.token}; path=/; max-age=${60 * 60 * 24 * 7}; ${isSecure ? "secure;" : ""} samesite=lax`;
      }

      let activeUser = payload?.user;
      if (activeUser && enrollCourseId) {
        try {
          const enrollRes = await fetch("/api/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: activeUser.id, courseId: enrollCourseId }),
          });
          if (enrollRes.ok) {
            const enrollPayload = await enrollRes.json();
            if (enrollPayload?.user) {
              activeUser = enrollPayload.user;
            }
          }
        } catch {
          // Ignore enrollment failure
        }
      }

      if (activeUser) {
        localStorage.setItem("lms_user", JSON.stringify(activeUser));
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitRegister} className="mt-8 max-w-xl space-y-5">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[color:var(--foreground)]">Nombre Completo</span>
        <input
          type="text"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[var(--surface)] px-4 text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
          placeholder="Juan Pérez"
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[color:var(--foreground)]">Correo electrónico</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[var(--surface)] px-4 text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
          placeholder="tu@correo.com"
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[color:var(--foreground)]">Contraseña</span>
        <input
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[var(--surface)] px-4 text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
          placeholder="••••••••"
          required
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold !text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creando cuenta..." : "Registrarse y entrar"}
      </button>
    </form>
  );
}
