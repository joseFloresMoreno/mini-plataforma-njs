"use client";

import { useState } from "react";

type ThemeMode = "light" | "dark";

const cookieName = "mini-plataforma-theme";
const cookieMaxAge = 60 * 60 * 24 * 365;

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

type ThemeToggleProps = {
  initialTheme: ThemeMode;
};

export function ThemeToggle({ initialTheme }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    document.cookie = `${cookieName}=${nextTheme}; path=/; max-age=${cookieMaxAge}; samesite=lax`;
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[color:var(--foreground)] shadow-sm transition hover:bg-[var(--surface-soft)]"
      aria-label="Cambiar tema"
      suppressHydrationWarning
    >
      <span className="text-base">{theme === "light" ? "☀" : "☾"}</span>
      <span>{theme === "light" ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
