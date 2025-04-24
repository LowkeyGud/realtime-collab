"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeInitializer() {
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    // Check if there's a theme in localStorage
    const storedTheme = localStorage.getItem("theme")

    if (storedTheme) {
      // Apply the stored theme
      setTheme(storedTheme)
    } else if (resolvedTheme) {
      // If no stored theme, but we have a resolved theme, use that
      setTheme(resolvedTheme)
    }

    // Force a re-render of the page to ensure theme is applied
    document.body.style.display = "none"
    setTimeout(() => {
      document.body.style.display = ""
    }, 0)
  }, [setTheme, resolvedTheme])

  return null
}
