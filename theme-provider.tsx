"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Theme, GameSettings } from "@/lib/game-settings"
import { getTheme, type ThemeColors } from "@/lib/themes"

interface ThemeContextValue {
  theme: ThemeColors
  themeName: Theme
  settings: GameSettings
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  themeName,
  settings,
}: {
  children: ReactNode
  themeName: Theme
  settings: GameSettings
}) {
  const theme = getTheme(themeName, settings.highContrast)

  return <ThemeContext.Provider value={{ theme, themeName, settings }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
