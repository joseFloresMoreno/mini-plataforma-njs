"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

type HeaderAction = {
  href: string;
  label: string;
  variant?: "ghost" | "primary";
};

type SiteHeaderProps = {
  brand: string;
  subtitle?: string;
  actions?: HeaderAction[];
};

export function SiteHeader({ brand, subtitle, actions = [] }: SiteHeaderProps) {
  const [initialTheme, setInitialTheme] = useState<"light" | "dark">("light");
  const [logoHref, setLogoHref] = useState("/");

  useEffect(() => {
    const themeCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("mini-plataforma-theme="))
      ?.split("=")[1];
    setInitialTheme(themeCookie === "dark" ? "dark" : "light");

    try {
      const stored = localStorage.getItem("lms_user");
      if (stored) {
        setLogoHref("/dashboard");
      } else {
        setLogoHref("/");
      }
    } catch {
      setLogoHref("/");
    }
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[var(--surface)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-12">
        <Link href={logoHref} className="flex min-w-0 items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-600/25">
            MP
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">{brand}</p>
            {subtitle ? (
              <p className="truncate text-xs text-slate-500">{subtitle}</p>
            ) : null}
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/courses"
            className="inline-flex h-10 items-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--surface-soft)]"
          >
            Cursos
          </Link>
          {actions.map((action) => {
            const isLogout = action.href === "/api/auth/logout";
            return (
              <Link
                key={action.href}
                href={action.href}
                className={
                  isLogout
                    ? "inline-flex h-10 items-center rounded-full border border-red-200 bg-[var(--surface)] px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-300"
                    : action.variant === "primary"
                      ? "inline-flex h-10 items-center rounded-full bg-blue-600 px-4 text-sm font-semibold !text-white transition hover:bg-blue-500"
                      : "inline-flex h-10 items-center rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[var(--surface-soft)]"
                }
              >
                {action.label}
              </Link>
            );
          })}
          <ThemeToggle initialTheme={initialTheme} />
        </div>
      </div>
    </header>
  );
}
