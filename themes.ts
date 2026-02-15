import type { Theme } from "./game-settings"

export interface ThemeColors {
  // Background gradients
  bgGradientFrom: string
  bgGradientVia: string
  bgGradientTo: string

  // Card backgrounds
  cardBg: string
  cardBorder: string

  // Tile colors (2048 standard)
  tiles: Record<number, { bg: string; text: string }>

  // UI elements
  primary: string
  primaryHover: string
  secondary: string
  secondaryHover: string

  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string

  // Accents
  accentGradientFrom: string
  accentGradientTo: string
}

export const themes: Record<Theme, ThemeColors> = {
  default: {
    bgGradientFrom: "from-slate-900",
    bgGradientVia: "via-purple-900",
    bgGradientTo: "to-slate-900",

    cardBg: "bg-slate-800/50",
    cardBorder: "border-slate-700",

    tiles: {
      2: { bg: "bg-[#eee4da]", text: "text-[#776e65]" },
      4: { bg: "bg-[#ede0c8]", text: "text-[#776e65]" },
      8: { bg: "bg-[#f2b179]", text: "text-white" },
      16: { bg: "bg-[#f59563]", text: "text-white" },
      32: { bg: "bg-[#f67c5f]", text: "text-white" },
      64: { bg: "bg-[#f65e3b]", text: "text-white" },
      128: { bg: "bg-[#edcf72]", text: "text-white" },
      256: { bg: "bg-[#edcc61]", text: "text-white" },
      512: { bg: "bg-[#edc850]", text: "text-white" },
      1024: { bg: "bg-[#edc53f]", text: "text-white" },
      2048: { bg: "bg-[#edc22e]", text: "text-white" },
      default: { bg: "bg-[#3c3a32]", text: "text-white" },
    },

    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    secondary: "bg-slate-700",
    secondaryHover: "hover:bg-slate-600",

    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",

    accentGradientFrom: "from-purple-600",
    accentGradientTo: "to-pink-600",
  },

  dark: {
    bgGradientFrom: "from-gray-950",
    bgGradientVia: "via-gray-900",
    bgGradientTo: "to-black",

    cardBg: "bg-gray-900/80",
    cardBorder: "border-gray-800",

    tiles: {
      2: { bg: "bg-gray-800", text: "text-gray-300" },
      4: { bg: "bg-gray-700", text: "text-gray-200" },
      8: { bg: "bg-gray-600", text: "text-white" },
      16: { bg: "bg-blue-900", text: "text-white" },
      32: { bg: "bg-blue-800", text: "text-white" },
      64: { bg: "bg-blue-700", text: "text-white" },
      128: { bg: "bg-indigo-800", text: "text-white" },
      256: { bg: "bg-indigo-700", text: "text-white" },
      512: { bg: "bg-indigo-600", text: "text-white" },
      1024: { bg: "bg-violet-700", text: "text-white" },
      2048: { bg: "bg-violet-600", text: "text-white" },
      default: { bg: "bg-gray-950", text: "text-white" },
    },

    primary: "bg-gray-700",
    primaryHover: "hover:bg-gray-600",
    secondary: "bg-gray-800",
    secondaryHover: "hover:bg-gray-750",

    textPrimary: "text-gray-100",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-500",

    accentGradientFrom: "from-gray-700",
    accentGradientTo: "to-gray-600",
  },

  ocean: {
    bgGradientFrom: "from-blue-950",
    bgGradientVia: "via-cyan-900",
    bgGradientTo: "to-teal-950",

    cardBg: "bg-blue-900/50",
    cardBorder: "border-cyan-800",

    tiles: {
      2: { bg: "bg-cyan-100", text: "text-cyan-900" },
      4: { bg: "bg-cyan-200", text: "text-cyan-900" },
      8: { bg: "bg-cyan-400", text: "text-white" },
      16: { bg: "bg-cyan-500", text: "text-white" },
      32: { bg: "bg-cyan-600", text: "text-white" },
      64: { bg: "bg-cyan-700", text: "text-white" },
      128: { bg: "bg-teal-500", text: "text-white" },
      256: { bg: "bg-teal-600", text: "text-white" },
      512: { bg: "bg-teal-700", text: "text-white" },
      1024: { bg: "bg-blue-600", text: "text-white" },
      2048: { bg: "bg-blue-500", text: "text-white" },
      default: { bg: "bg-blue-950", text: "text-white" },
    },

    primary: "bg-cyan-600",
    primaryHover: "hover:bg-cyan-700",
    secondary: "bg-blue-800",
    secondaryHover: "hover:bg-blue-700",

    textPrimary: "text-cyan-50",
    textSecondary: "text-cyan-200",
    textMuted: "text-cyan-400",

    accentGradientFrom: "from-cyan-600",
    accentGradientTo: "to-blue-600",
  },

  forest: {
    bgGradientFrom: "from-green-950",
    bgGradientVia: "via-emerald-900",
    bgGradientTo: "to-teal-950",

    cardBg: "bg-green-900/50",
    cardBorder: "border-emerald-800",

    tiles: {
      2: { bg: "bg-lime-100", text: "text-green-900" },
      4: { bg: "bg-lime-200", text: "text-green-900" },
      8: { bg: "bg-lime-400", text: "text-green-900" },
      16: { bg: "bg-lime-500", text: "text-white" },
      32: { bg: "bg-green-500", text: "text-white" },
      64: { bg: "bg-green-600", text: "text-white" },
      128: { bg: "bg-emerald-500", text: "text-white" },
      256: { bg: "bg-emerald-600", text: "text-white" },
      512: { bg: "bg-emerald-700", text: "text-white" },
      1024: { bg: "bg-teal-600", text: "text-white" },
      2048: { bg: "bg-teal-500", text: "text-white" },
      default: { bg: "bg-green-950", text: "text-white" },
    },

    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    secondary: "bg-green-800",
    secondaryHover: "hover:bg-green-700",

    textPrimary: "text-green-50",
    textSecondary: "text-green-200",
    textMuted: "text-green-400",

    accentGradientFrom: "from-emerald-600",
    accentGradientTo: "to-teal-600",
  },

  neon: {
    bgGradientFrom: "from-black",
    bgGradientVia: "via-purple-950",
    bgGradientTo: "to-black",

    cardBg: "bg-black/80",
    cardBorder: "border-pink-500",

    tiles: {
      2: { bg: "bg-pink-500", text: "text-white" },
      4: { bg: "bg-fuchsia-500", text: "text-white" },
      8: { bg: "bg-purple-500", text: "text-white" },
      16: { bg: "bg-violet-500", text: "text-white" },
      32: { bg: "bg-indigo-500", text: "text-white" },
      64: { bg: "bg-blue-500", text: "text-white" },
      128: { bg: "bg-cyan-500", text: "text-black" },
      256: { bg: "bg-teal-400", text: "text-black" },
      512: { bg: "bg-emerald-400", text: "text-black" },
      1024: { bg: "bg-lime-400", text: "text-black" },
      2048: { bg: "bg-yellow-400", text: "text-black" },
      default: { bg: "bg-black", text: "text-pink-500" },
    },

    primary: "bg-pink-600",
    primaryHover: "hover:bg-pink-700",
    secondary: "bg-purple-900",
    secondaryHover: "hover:bg-purple-800",

    textPrimary: "text-pink-50",
    textSecondary: "text-pink-200",
    textMuted: "text-pink-400",

    accentGradientFrom: "from-pink-600",
    accentGradientTo: "to-purple-600",
  },

  nature: {
    bgGradientFrom: "from-amber-950",
    bgGradientVia: "via-green-950",
    bgGradientTo: "to-emerald-950",

    cardBg: "bg-amber-950/50",
    cardBorder: "border-green-700",

    tiles: {
      2: { bg: "bg-amber-100", text: "text-amber-900" },
      4: { bg: "bg-amber-200", text: "text-amber-900" },
      8: { bg: "bg-orange-300", text: "text-orange-900" },
      16: { bg: "bg-orange-400", text: "text-white" },
      32: { bg: "bg-yellow-500", text: "text-yellow-900" },
      64: { bg: "bg-lime-500", text: "text-lime-900" },
      128: { bg: "bg-green-500", text: "text-white" },
      256: { bg: "bg-emerald-600", text: "text-white" },
      512: { bg: "bg-teal-600", text: "text-white" },
      1024: { bg: "bg-cyan-700", text: "text-white" },
      2048: { bg: "bg-sky-600", text: "text-white" },
      default: { bg: "bg-stone-800", text: "text-amber-200" },
    },

    primary: "bg-green-700",
    primaryHover: "hover:bg-green-800",
    secondary: "bg-amber-800",
    secondaryHover: "hover:bg-amber-700",

    textPrimary: "text-amber-50",
    textSecondary: "text-amber-200",
    textMuted: "text-amber-400",

    accentGradientFrom: "from-green-600",
    accentGradientTo: "to-amber-600",
  },

  minimalist: {
    bgGradientFrom: "from-white",
    bgGradientVia: "via-gray-50",
    bgGradientTo: "to-gray-100",

    cardBg: "bg-white/90",
    cardBorder: "border-gray-300",

    tiles: {
      2: { bg: "bg-gray-100", text: "text-gray-700" },
      4: { bg: "bg-gray-200", text: "text-gray-800" },
      8: { bg: "bg-gray-300", text: "text-gray-900" },
      16: { bg: "bg-gray-400", text: "text-white" },
      32: { bg: "bg-gray-500", text: "text-white" },
      64: { bg: "bg-gray-600", text: "text-white" },
      128: { bg: "bg-gray-700", text: "text-white" },
      256: { bg: "bg-gray-800", text: "text-white" },
      512: { bg: "bg-gray-900", text: "text-white" },
      1024: { bg: "bg-black", text: "text-white" },
      2048: { bg: "bg-blue-600", text: "text-white" },
      default: { bg: "bg-gray-200", text: "text-gray-600" },
    },

    primary: "bg-gray-800",
    primaryHover: "hover:bg-gray-900",
    secondary: "bg-gray-200",
    secondaryHover: "hover:bg-gray-300",

    textPrimary: "text-gray-900",
    textSecondary: "text-gray-700",
    textMuted: "text-gray-500",

    accentGradientFrom: "from-gray-700",
    accentGradientTo: "to-gray-900",
  },
}

// High contrast versions for accessibility
export const highContrastOverrides: Partial<ThemeColors> = {
  tiles: {
    2: { bg: "bg-yellow-200", text: "text-black" },
    4: { bg: "bg-yellow-300", text: "text-black" },
    8: { bg: "bg-orange-400", text: "text-black" },
    16: { bg: "bg-orange-500", text: "text-white" },
    32: { bg: "bg-red-500", text: "text-white" },
    64: { bg: "bg-red-600", text: "text-white" },
    128: { bg: "bg-pink-600", text: "text-white" },
    256: { bg: "bg-purple-600", text: "text-white" },
    512: { bg: "bg-blue-600", text: "text-white" },
    1024: { bg: "bg-green-600", text: "text-white" },
    2048: { bg: "bg-cyan-600", text: "text-black" },
    default: { bg: "bg-black", text: "text-white" },
  },
}

export const getTheme = (themeName: Theme, highContrast = false): ThemeColors => {
  const baseTheme = themes[themeName]

  if (highContrast) {
    return {
      ...baseTheme,
      ...highContrastOverrides,
      tiles: { ...baseTheme.tiles, ...highContrastOverrides.tiles },
    }
  }

  return baseTheme
}

export const getTileColor = (value: number, theme: ThemeColors): string => {
  const tileColor = theme.tiles[value] || theme.tiles.default
  return `${tileColor.bg} ${tileColor.text}`
}
