export type ThemePreference = "light" | "dark" | "system"

export function applyTheme(theme: ThemePreference) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = theme === "dark" || (theme === "system" && prefersDark)
    const root = document.documentElement

    root.classList.toggle("dark", isDark)
    root.style.colorScheme = isDark ? "dark" : "light"
}