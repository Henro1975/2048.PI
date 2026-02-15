export const triggerHaptic = (type: "light" | "medium" | "heavy" | "success" | "error", enabled = true) => {
  if (!enabled || typeof window === "undefined" || !("vibrate" in navigator)) {
    return
  }

  const patterns = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    error: [20, 100, 20],
  }

  try {
    navigator.vibrate(patterns[type])
  } catch (error) {
    console.error("Haptic feedback failed:", error)
  }
}

export const hapticFeedback = {
  tileMove: (enabled: boolean) => triggerHaptic("light", enabled),
  tileMerge: (enabled: boolean) => triggerHaptic("medium", enabled),
  gameWon: (enabled: boolean) => triggerHaptic("success", enabled),
  gameOver: (enabled: boolean) => triggerHaptic("error", enabled),
  buttonPress: (enabled: boolean) => triggerHaptic("light", enabled),
}
