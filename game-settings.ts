export type GameMode = "classic" | "timed" | "zen" | "challenge"
export type GridSize = 3 | 4 | 5 | 6
export type Theme = "default" | "dark" | "ocean" | "forest" | "neon" | "nature" | "minimalist"
export type AnimationSpeed = "slow" | "normal" | "fast"

export interface GameSettings {
  // Display
  theme: Theme
  animationSpeed: AnimationSpeed
  showGridNumbers: boolean

  // Audio
  soundEnabled: boolean
  musicEnabled: boolean
  volume: number

  // Gameplay
  swipeSensitivity: number
  hapticFeedback: boolean
  confirmExit: boolean

  // Accessibility
  highContrast: boolean
  reducedMotion: boolean
  fontSize: "normal" | "large"
}

export interface GameModeConfig {
  id: GameMode
  name: string
  description: string
  icon: string
  features: {
    hasTimeLimit?: boolean
    timeLimit?: number
    hasScoreGoal?: boolean
    scoreGoal?: number
    hasUndo?: boolean
    undoLimit?: number // -1 for unlimited
    customRules?: string
  }
}

export const DEFAULT_SETTINGS: GameSettings = {
  theme: "default",
  animationSpeed: "normal",
  showGridNumbers: false,
  soundEnabled: true,
  musicEnabled: false,
  volume: 70,
  swipeSensitivity: 50,
  hapticFeedback: true,
  confirmExit: true,
  highContrast: false,
  reducedMotion: false,
  fontSize: "normal",
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Original 2048 gameplay. Merge tiles to reach 2048!",
    icon: "🎮",
    features: {
      hasUndo: false,
    },
  },
  {
    id: "timed",
    name: "Time Trial",
    description: "Race against the clock! Reach 2048 as fast as possible.",
    icon: "⏱️",
    features: {
      hasTimeLimit: false,
      hasUndo: false,
    },
  },
  {
    id: "zen",
    name: "Zen Mode",
    description: "Relaxed gameplay with unlimited undo. Perfect for learning.",
    icon: "☮️",
    features: {
      hasUndo: true,
      undoLimit: -1, // unlimited
    },
  },
  {
    id: "challenge",
    name: "Challenge",
    description: "Reach the target score with limited undos!",
    icon: "🏆",
    features: {
      hasScoreGoal: true,
      scoreGoal: 10000,
      hasUndo: true,
      undoLimit: 3, // limited to 3 undos
      customRules: "Reach 10,000 points with only 3 undos",
    },
  },
]

// Helper to check if undo is allowed for a game mode
export const canUndoInMode = (mode: GameMode): boolean => {
  const modeConfig = GAME_MODES.find((m) => m.id === mode)
  return modeConfig?.features.hasUndo || false
}

// Get undo limit for a game mode
export const getUndoLimit = (mode: GameMode): number => {
  const modeConfig = GAME_MODES.find((m) => m.id === mode)
  return modeConfig?.features.undoLimit || 0
}

export const loadSettings = (): GameSettings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  try {
    const saved = localStorage.getItem("2048pi-settings")
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch (error) {
    console.error("Failed to load settings:", error)
  }

  return DEFAULT_SETTINGS
}

export const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem("2048pi-settings", JSON.stringify(settings))
  } catch (error) {
    console.error("Failed to save settings:", error)
  }
}
