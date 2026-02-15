export interface MoveRecord {
  id: string
  direction: "up" | "down" | "left" | "right"
  timestamp: number
  scoreChange: number
  boardStateBefore: number[][]
  boardStateAfter: number[][]
  tilesCreated: number[]
  tilesMerged: { from: number[]; to: number }[]
}

export interface GameHistory {
  moves: MoveRecord[]
  startTime: number
  endTime?: number
  finalScore: number
  gridSize: number
  gameMode: string
}

export const saveGameHistory = (history: GameHistory) => {
  const histories = loadGameHistories()
  histories.unshift(history)
  // Keep only last 10 games
  if (histories.length > 10) {
    histories.length = 10
  }
  localStorage.setItem("2048pi-game-histories", JSON.stringify(histories))
}

export const loadGameHistories = (): GameHistory[] => {
  const saved = localStorage.getItem("2048pi-game-histories")
  return saved ? JSON.parse(saved) : []
}

export const getMoveIcon = (direction: string) => {
  const icons = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
  }
  return icons[direction as keyof typeof icons] || "•"
}

export const formatMoveTime = (timestamp: number, startTime: number): string => {
  const elapsed = Math.floor((timestamp - startTime) / 1000)
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
