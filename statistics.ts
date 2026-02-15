import type { GameMode, GridSize } from "./game-settings"

export interface GameStats {
  totalGames: number
  totalWins: number
  totalScore: number
  highestTile: number
  bestScore: number
  bestTime: number // in seconds (for timed mode, 0 = not set)
  totalMoves: number
  totalPlayTime: number // in seconds
  bestMoves: number // fewest moves to reach 2048
  avgMovesPerWin: number // average moves per winning game

  // Per mode stats
  modeStats: Record<
    GameMode,
    {
      games: number
      wins: number
      bestScore: number
      bestMoves: number // Minimum moves to reach 2048 tile in this mode
      avgMovesPerWin: number // Average moves per win in this mode
    }
  >

  // Per grid size stats
  gridStats: Record<
    GridSize,
    {
      games: number
      wins: number
      bestScore: number
      bestMoves: number // Minimum moves to reach 2048 tile on this grid size
      avgMovesPerWin: number // Average moves per win on this grid size
    }
  >

  // Streaks
  currentWinStreak: number
  bestWinStreak: number

  // Achievements unlocked
  achievementsUnlocked: string[]

  // Last updated
  lastPlayed: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "score" | "tiles" | "games" | "special"
  requirement: (stats: GameStats) => boolean
  reward?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  // Score achievements
  {
    id: "score_1k",
    name: "Getting Started",
    description: "Score 1,000 points in a single game",
    icon: "🌟",
    category: "score",
    requirement: (stats) => stats.bestScore >= 1000,
  },
  {
    id: "score_5k",
    name: "Point Master",
    description: "Score 5,000 points in a single game",
    icon: "⭐",
    category: "score",
    requirement: (stats) => stats.bestScore >= 5000,
  },
  {
    id: "score_10k",
    name: "Score Legend",
    description: "Score 10,000 points in a single game",
    icon: "🏆",
    category: "score",
    requirement: (stats) => stats.bestScore >= 10000,
  },
  {
    id: "score_50k",
    name: "Ultimate Scorer",
    description: "Score 50,000 points in a single game",
    icon: "👑",
    category: "score",
    requirement: (stats) => stats.bestScore >= 50000,
  },

  // Tile achievements
  {
    id: "tile_128",
    name: "Stepping Up",
    description: "Create a 128 tile",
    icon: "📈",
    category: "tiles",
    requirement: (stats) => stats.highestTile >= 128,
  },
  {
    id: "tile_256",
    name: "Power Surge",
    description: "Create a 256 tile",
    icon: "⚡",
    category: "tiles",
    requirement: (stats) => stats.highestTile >= 256,
  },
  {
    id: "tile_512",
    name: "Half Way There",
    description: "Create a 512 tile",
    icon: "🎯",
    category: "tiles",
    requirement: (stats) => stats.highestTile >= 512,
  },
  {
    id: "tile_1024",
    name: "First 1024 Tile",
    description: "Create your first 1024 tile",
    icon: "🔥",
    category: "tiles",
    requirement: (stats) => stats.highestTile >= 1024,
  },
  {
    id: "tile_2048",
    name: "The Champion",
    description: "Create a 2048 tile",
    icon: "💎",
    category: "tiles",
    requirement: (stats) => stats.highestTile >= 2048,
  },
  {
    id: "tile_4096",
    name: "Beyond Limits",
    description: "Create a 4096 tile",
    icon: "🌠",
    category: "tiles",
    requirement: (stats) => stats.highestTile >= 4096,
  },
  {
    id: "tile_8192",
    name: "Legendary",
    description: "Create an 8192 tile",
    icon: "👑",
    category: "tiles",
    requirement: (stats) => stats.highestTile >= 8192,
  },

  // Games achievements
  {
    id: "games_10",
    name: "Dedicated Player",
    description: "Play 10 games",
    icon: "🎮",
    category: "games",
    requirement: (stats) => stats.totalGames >= 10,
  },
  {
    id: "games_50",
    name: "Experienced",
    description: "Play 50 games",
    icon: "🎯",
    category: "games",
    requirement: (stats) => stats.totalGames >= 50,
  },
  {
    id: "games_100",
    name: "Veteran",
    description: "Play 100 games",
    icon: "🏅",
    category: "games",
    requirement: (stats) => stats.totalGames >= 100,
  },
  {
    id: "wins_5",
    name: "Winner",
    description: "Win 5 games",
    icon: "🏆",
    category: "games",
    requirement: (stats) => stats.totalWins >= 5,
  },
  {
    id: "wins_20",
    name: "Champion",
    description: "Win 20 games",
    icon: "👑",
    category: "games",
    requirement: (stats) => stats.totalWins >= 20,
  },

  // Special achievements
  {
    id: "streak_3",
    name: "On Fire",
    description: "Win 3 games in a row",
    icon: "🔥",
    category: "special",
    requirement: (stats) => stats.currentWinStreak >= 3 || stats.bestWinStreak >= 3,
  },
  {
    id: "streak_5",
    name: "Unstoppable",
    description: "Win 5 games in a row",
    icon: "💫",
    category: "special",
    requirement: (stats) => stats.bestWinStreak >= 5,
  },
  {
    id: "all_modes",
    name: "Mode Master",
    description: "Win at least once in each game mode",
    icon: "🎨",
    category: "special",
    requirement: (stats) => Object.values(stats.modeStats).every((mode) => mode.wins >= 1),
  },
  {
    id: "all_grids",
    name: "Grid Explorer",
    description: "Win at least once on each grid size",
    icon: "🗺️",
    category: "special",
    requirement: (stats) => Object.values(stats.gridStats).every((grid) => grid.wins >= 1),
  },
  {
    id: "speed_100_moves",
    name: "Speed Demon",
    description: "Reach 2048 in under 100 moves",
    icon: "⚡",
    category: "special",
    requirement: (stats) => stats.bestMoves > 0 && stats.bestMoves < 100 && stats.highestTile >= 2048,
  },
  {
    id: "speed_150_moves",
    name: "Quick Thinker",
    description: "Reach 2048 in under 150 moves",
    icon: "🧠",
    category: "special",
    requirement: (stats) => stats.bestMoves > 0 && stats.bestMoves < 150 && stats.highestTile >= 2048,
  },
  {
    id: "efficient_player",
    name: "Efficiency Expert",
    description: "Win a game with an average of less than 3 moves per tile merge",
    icon: "🎓",
    category: "special",
    requirement: (stats) => stats.avgMovesPerWin > 0 && stats.avgMovesPerWin < 120,
  },
]

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  totalWins: 0,
  totalScore: 0,
  highestTile: 0,
  bestScore: 0,
  bestTime: 0,
  totalMoves: 0,
  totalPlayTime: 0,
  bestMoves: 0,
  avgMovesPerWin: 0,
  modeStats: {
    classic: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
    timed: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
    zen: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
    challenge: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
  },
  gridStats: {
    3: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
    4: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
    5: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
    6: { games: 0, wins: 0, bestScore: 0, bestMoves: 0, avgMovesPerWin: 0 },
  },
  currentWinStreak: 0,
  bestWinStreak: 0,
  achievementsUnlocked: [],
  lastPlayed: Date.now(),
}

export const loadStats = (): GameStats => {
  if (typeof window === "undefined") return DEFAULT_STATS

  try {
    const saved = localStorage.getItem("2048pi-stats")
    if (saved) {
      return { ...DEFAULT_STATS, ...JSON.parse(saved) }
    }
  } catch (error) {
    console.error("Failed to load stats:", error)
  }

  return DEFAULT_STATS
}

export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem("2048pi-stats", JSON.stringify(stats))
  } catch (error) {
    console.error("Failed to save stats:", error)
  }
}

export const updateStats = (
  currentStats: GameStats,
  gameData: {
    score: number
    moves: number
    playTime: number
    highestTile: number
    won: boolean
    mode: GameMode
    gridSize: GridSize
  },
): { stats: GameStats; newAchievements: Achievement[] } => {
  const newStats: GameStats = {
    ...currentStats,
    totalGames: currentStats.totalGames + 1,
    totalWins: currentStats.totalWins + (gameData.won ? 1 : 0),
    totalScore: currentStats.totalScore + gameData.score,
    totalMoves: currentStats.totalMoves + gameData.moves,
    totalPlayTime: currentStats.totalPlayTime + gameData.playTime,
    lastPlayed: Date.now(),
  }

  // Update best score
  if (gameData.score > newStats.bestScore) {
    newStats.bestScore = gameData.score
  }

  // Update highest tile
  if (gameData.highestTile > newStats.highestTile) {
    newStats.highestTile = gameData.highestTile
  }

  // Update best time (only for timed mode wins)
  if (gameData.mode === "timed" && gameData.won) {
    if (newStats.bestTime === 0 || gameData.playTime < newStats.bestTime) {
      newStats.bestTime = gameData.playTime
    }
  }

  // Update mode stats
  newStats.modeStats[gameData.mode].games++
  if (gameData.won) {
    newStats.modeStats[gameData.mode].wins++
  }
  if (gameData.score > newStats.modeStats[gameData.mode].bestScore) {
    newStats.modeStats[gameData.mode].bestScore = gameData.score
  }
  if (
    gameData.moves < newStats.modeStats[gameData.mode].bestMoves ||
    newStats.modeStats[gameData.mode].bestMoves === 0
  ) {
    newStats.modeStats[gameData.mode].bestMoves = gameData.moves
  }
  if (gameData.won) {
    newStats.modeStats[gameData.mode].avgMovesPerWin =
      (newStats.modeStats[gameData.mode].avgMovesPerWin * (newStats.modeStats[gameData.mode].wins - 1) +
        gameData.moves) /
      newStats.modeStats[gameData.mode].wins
  }

  // Update grid stats
  newStats.gridStats[gameData.gridSize].games++
  if (gameData.won) {
    newStats.gridStats[gameData.gridSize].wins++
  }
  if (gameData.score > newStats.gridStats[gameData.gridSize].bestScore) {
    newStats.gridStats[gameData.gridSize].bestScore = gameData.score
  }
  if (
    gameData.moves < newStats.gridStats[gameData.gridSize].bestMoves ||
    newStats.gridStats[gameData.gridSize].bestMoves === 0
  ) {
    newStats.gridStats[gameData.gridSize].bestMoves = gameData.moves
  }
  if (gameData.won) {
    newStats.gridStats[gameData.gridSize].avgMovesPerWin =
      (newStats.gridStats[gameData.gridSize].avgMovesPerWin * (newStats.gridStats[gameData.gridSize].wins - 1) +
        gameData.moves) /
      newStats.gridStats[gameData.gridSize].wins
  }

  // Update win streaks
  if (gameData.won) {
    newStats.currentWinStreak++
    if (newStats.currentWinStreak > newStats.bestWinStreak) {
      newStats.bestWinStreak = newStats.currentWinStreak
    }
  } else {
    newStats.currentWinStreak = 0
  }

  if (gameData.won && gameData.highestTile >= 2048) {
    if (newStats.bestMoves === 0 || gameData.moves < newStats.bestMoves) {
      newStats.bestMoves = gameData.moves
    }
  }

  if (newStats.totalWins > 0) {
    newStats.avgMovesPerWin = Math.round(newStats.totalMoves / newStats.totalWins)
  }

  // Check for new achievements
  const newAchievements: Achievement[] = []
  for (const achievement of ACHIEVEMENTS) {
    if (!newStats.achievementsUnlocked.includes(achievement.id) && achievement.requirement(newStats)) {
      newStats.achievementsUnlocked.push(achievement.id)
      newAchievements.push(achievement)
    }
  }

  return { stats: newStats, newAchievements }
}

export const getAchievementProgress = (stats: GameStats): { unlocked: number; total: number; percentage: number } => {
  const unlocked = stats.achievementsUnlocked.length
  const total = ACHIEVEMENTS.length
  const percentage = Math.round((unlocked / total) * 100)

  return { unlocked, total, percentage }
}
