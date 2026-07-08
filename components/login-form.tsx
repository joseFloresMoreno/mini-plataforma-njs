"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { demoUsers } from "@/lib/lms-data";

type LoginState = {
  email: string;
  password: string;
};

const initialState: LoginState = {
  email: "ana@demo.com",
  password: "lms123",
};

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<LoginState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; token?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "No se pudo iniciar sesión");
      }

      if (payload?.token) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        document.cookie = `lms_session=${payload.token}; path=/; max-age=${60 * 60 * 24 * 7}; ${isSecure ? "secure;" : ""} samesite=lax`;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={submitLogin} className="mt-8 max-w-xl space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Correo electrónico</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[var(--surface)] px-4 text-[color:var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
            placeholder="tu@correo.com"
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
          {isSubmitting ? "Validando sesión..." : "Entrar al sistema"}
        </button>
      </form>

      <div className="mt-8 max-w-xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
          Cuentas de demo
        </p>
        <div className="space-y-4">
          {demoUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => setForm({ email: user.email, password: user.password })}
              className="flex w-full items-center justify-between rounded-3xl border border-[color:var(--border)] bg-[var(--surface)] px-4 py-4 text-left transition hover:border-blue-400 hover:bg-[var(--surface-soft)]"
            >
              <div>
                <p className="font-semibold text-[color:var(--foreground)]">{user.name}</p>
                <p className="mt-1 text-sm text-slate-700">{user.email}</p>
              </div>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-blue-800">
                Demo
              </span>
            </button>
          ))}
        </div>
        <div className="rounded-3xl border border-[color:var(--border)] bg-[var(--surface-soft)] p-5 text-sm text-[color:var(--foreground)]">
          <p className="font-semibold text-[color:var(--foreground)]">Credenciales rápidas</p>
          <p className="mt-2 text-slate-600">Correo: <span className="font-medium text-[color:var(--foreground)]">ana@demo.com</span></p>
          <p className="mt-1 text-slate-600">Contraseña: <span className="font-medium text-[color:var(--foreground)]">lms123</span></p>
        </div>
      </div>
    </>
  );
}
