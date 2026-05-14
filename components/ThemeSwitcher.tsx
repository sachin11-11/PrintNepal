"use client";

import { useEffect, useState } from "react";

type ThemeName = "light" | "night";

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("printnepal-theme", theme);
}

function Icon({ theme }: { theme: ThemeName }) {
  if (theme === "night") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 14.8A8.5 8.5 0 0 1 9.2 3 7 7 0 1 0 21 14.8Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
  );
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("printnepal-theme");
    const nextTheme = savedTheme === "night" || savedTheme === "light" ? savedTheme : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "night" ? "light" : "night";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      aria-label={`Switch to ${theme === "night" ? "light" : "night"} theme`}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--surface)] px-3 text-sm font-black text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
      onClick={toggleTheme}
      title={`Switch to ${theme === "night" ? "light" : "night"} theme`}
      type="button"
    >
      <Icon theme={theme} />
      <span className="hidden sm:inline">{theme === "night" ? "Night" : "Light"}</span>
    </button>
  );
}
