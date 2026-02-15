"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Trophy, RotateCcw, Undo, Redo, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { hapticFeedback } from "@/lib/haptics"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import {
  type GameSettings,
  type GameMode,
  type GridSize,
  loadSettings,
  saveSettings,
  canUndoInMode,
  getUndoLimit,
} from "@/lib/game-settings"
import { useUndoRedo } from "@/hooks/use-undo-redo"
import { getTileColor } from "@/lib/themes"
import { StatisticsDashboard } from "@/components/statistics-dashboard"
import { MoveHistoryPanel } from "@/components/move-history-panel"
import type { MoveRecord } from "@/lib/move-history"
import { GameStats } from "@/lib/game-stats"
import { saveGameState } from "@/lib/game-state"
import { addToHistory } from "@/lib/history"
import { addRandomTile } from "@/lib/tiles"
import { ModeSelector } from "@/components/mode-selector"
import { Cloud } from "lucide-react"
import { SettingsPanel } from "@/components/settings-panel"
import { CloudSavePanel } from "@/components/cloud-save-panel" // Import CloudSavePanel

type Tile = {
  id: number
  value: number
  position: { row: number; col: number }
  isNew: boolean
  isMerged: boolean
}

interface UndoableGameState {
  tiles: Tile[]
  score: number
  moveCount: number
  gameOver: boolean
  gameWon: boolean
}

function Game2048Content() {
  const { theme, settings } = useTheme()
  const [gridSize, setGridSize] = useState<GridSize>(4)
  const [gameMode, setGameMode] = useState<GameMode>("classic")
  const [tiles, setTiles] = useState<Tile[]>([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<"menu" | "game" | "settings" | "stats" | "history">("menu")
  const [moveCount, setMoveCount] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [usedUndos, setUsedUndos] = useState(0)
  const [showAchievementNotification, setShowAchievementNotification] = useState<string | null>(null)
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([])
  const [gameStartTime, setGameStartTime] = useState(Date.now())
  const [stats, setStats] = useState<GameStats>(new GameStats())
  const [showCloudSave, setShowCloudSave] = useState(false)
  const [replayMode, setReplayMode] = useState(false)

  const undoRedo = useUndoRedo<UndoableGameState>({
    tiles: [],
    score: 0,
    moveCount: 0,
    gameOver: false,
    gameWon: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem("2048pi-best-score")
    if (saved) setBestScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("2048pi-best-score", score.toString())
    }
  }, [score, bestScore])

  useEffect(() => {
    if (gameMode === "timed" && isTimerRunning && !gameOver && !gameWon) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameMode, isTimerRunning, gameOver, gameWon])

  const initializeGame = useCallback(() => {
    const newTiles: Tile[] = []
    let idCounter = 0

    for (let i = 0; i < 2; i++) {
      const emptyPositions = getEmptyPositions(newTiles, gridSize)
      if (emptyPositions.length > 0) {
        const pos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
        newTiles.push({
          id: idCounter++,
          value: Math.random() < 0.9 ? 2 : 4,
          position: pos,
          isNew: true,
          isMerged: false,
        })
      }
    }

    setTiles(newTiles)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setMoveCount(0)
    setTimeElapsed(0)
    setIsTimerRunning(gameMode === "timed")
    setUsedUndos(0)
    setMoveHistory([])
    setGameStartTime(Date.now())
    undoRedo.reset({
      tiles: newTiles,
      score: 0,
      moveCount: 0,
      gameOver: false,
      gameWon: false,
    })
  }, [gridSize, gameMode, undoRedo])

  useEffect(() => {
    if (currentScreen === "game") {
      initializeGame()
    }
  }, [currentScreen, gridSize, gameMode, initializeGame])

  const getEmptyPositions = (currentTiles: Tile[], size: GridSize) => {
    const positions: { row: number; col: number }[] = []
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!currentTiles.find((t) => t.position.row === row && t.position.col === col)) {
          positions.push({ row, col })
        }
      }
    }
    return positions
  }

  const moveTiles = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameOver || gameWon || replayMode) return

      const newGrid = Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(0))
      let newScore = score
      let moved = false
      const mergedPositions: Set<string> = new Set()
      let mergeCount = 0

      const getLineIndices = (lineIndex: number): number[] => {
        if (direction === "up" || direction === "down") {
          return Array.from({ length: gridSize }, (_, i) => i)
        } else {
          return Array.from({ length: gridSize }, (_, i) => i)
        }
      }

      const getLine = (lineIndex: number): Tile[] => {
        if (direction === "up" || direction === "down") {
          return tiles.filter((t) => t.position.col === lineIndex).sort((a, b) => a.position.row - b.position.row)
        } else {
          return tiles.filter((t) => t.position.row === lineIndex).sort((a, b) => a.position.col - b.position.col)
        }
      }

      const processLine = (line: Tile[], reverse: boolean): Tile[] => {
        if (reverse) line = [...line].reverse()

        const merged: boolean[] = new Array(line.length).fill(false)
        const result: Tile[] = []

        for (let i = 0; i < line.length; i++) {
          if (merged[i]) continue

          if (i < line.length - 1 && line[i].value === line[i + 1].value && !merged[i + 1]) {
            result.push({
              ...line[i],
              value: line[i].value * 2,
              isMerged: true,
            })
            newScore += line[i].value * 2
            mergedPositions.add(`${line[i].position.row},${line[i].position.col}`)
            mergeCount++
            merged[i] = true
            merged[i + 1] = true
            i++
          } else {
            result.push(line[i])
          }
        }

        if (reverse) result.reverse()
        return result
      }

      for (let i = 0; i < gridSize; i++) {
        const line = getLine(i)
        if (line.length === 0) continue

        const processed = processLine(line, direction === "down" || direction === "right")

        processed.forEach((tile, index) => {
          const tileInNewGrid = newGrid[tile.position.row][tile.position.col]
          if (tileInNewGrid === 0) {
            newGrid[tile.position.row][tile.position.col] = tile.value
            moved = true
          }
        })
      }

      if (moved) {
        hapticFeedback.tileMove(settings.hapticFeedback)

        if (mergeCount > 0) {
          hapticFeedback.tileMerge(settings.hapticFeedback)
        }

        const moveData: MoveRecord = {
          direction,
          timestamp: Date.now(),
          scoreChange: newScore - score,
          tilesChanged: mergeCount,
        }

        saveGameState(tiles, score, moveCount)
        addToHistory(moveData)

        setTiles(newGrid)
        setScore(newScore)
        setMoveCount((prev) => prev + 1)

        setTimeout(() => {
          addRandomTile(newGrid)
        }, 150)

        if (newScore > bestScore) {
          setBestScore(newScore)
          localStorage.setItem("2048pi-best-score", newScore.toString())
        }

        stats.incrementMoves()
        const maxTile = Math.max(...newGrid.flat())
        stats.updateHighestTile(maxTile)
      }
    },
    [gridSize, tiles, score, moveCount, gameOver, gameWon, replayMode, settings, stats],
  )

  const handleUndo = useCallback(() => {
    if (!canUndoInMode(gameMode)) return

    const undoLimit = getUndoLimit(gameMode)
    if (undoLimit !== -1 && usedUndos >= undoLimit) {
      return
    }

    const previousState = undoRedo.undo()
    if (previousState) {
      setTiles(previousState.tiles.map((t) => ({ ...t })))
      setScore(previousState.score)
      setMoveCount(previousState.moveCount)
      setGameOver(previousState.gameOver)
      setGameWon(previousState.gameWon)
      setUsedUndos((prev) => prev + 1)
    }
  }, [gameMode, usedUndos, undoRedo])

  const handleRedo = useCallback(() => {
    if (!canUndoInMode(gameMode)) return

    const nextState = undoRedo.redo()
    if (nextState) {
      setTiles(nextState.tiles.map((t) => ({ ...t })))
      setScore(nextState.score)
      setMoveCount(nextState.moveCount)
      setGameOver(nextState.gameOver)
      setGameWon(nextState.gameWon)
      if (usedUndos > 0) {
        setUsedUndos((prev) => prev - 1)
      }
    }
  }, [gameMode, usedUndos, undoRedo])

  const isGameOver = (currentTiles: Tile[]): boolean => {
    if (getEmptyPositions(currentTiles, gridSize).length > 0) return false

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const tile = currentTiles.find((t) => t.position.row === row && t.position.col === col)
        if (!tile) continue

        if (col < gridSize - 1) {
          const right = currentTiles.find((t) => t.position.row === row && t.position.col === col + 1)
          if (right && right.value === tile.value) return false
        }

        if (row < gridSize - 1) {
          const down = currentTiles.find((t) => t.position.row === row + 1 && t.position.col === col)
          if (down && down.value === tile.value) return false
        }
      }
    }

    return true
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentScreen !== "game") return

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        const directionMap: Record<string, "up" | "down" | "left" | "right"> = {
          ArrowUp: "up",
          ArrowDown: "down",
          ArrowLeft: "left",
          ArrowRight: "right",
        }
        moveTiles(directionMap[e.key])
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentScreen, tiles, gameOver, gameWon, handleUndo, handleRedo])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const deltaX = e.changedTouches[0].clientX - touchStart.x
    const deltaY = e.changedTouches[0].clientY - touchStart.y
    const minSwipeDistance = 30 * (settings.swipeSensitivity / 50)

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        moveTiles(deltaX > 0 ? "right" : "left")
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        moveTiles(deltaY > 0 ? "down" : "up")
      }
    }

    setTouchStart(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTileSize = () => {
    const baseSizes =
      settings.fontSize === "large"
        ? {
            3: "w-24 h-24 text-4xl",
            4: "w-20 h-20 text-3xl",
            5: "w-16 h-16 text-2xl",
            6: "w-14 h-14 text-xl",
          }
        : {
            3: "w-24 h-24 text-3xl",
            4: "w-20 h-20 text-2xl",
            5: "w-16 h-16 text-xl",
            6: "w-14 h-14 text-lg",
          }
    return baseSizes[gridSize]
  }

  const getGridGap = () => {
    const gaps = {
      3: "gap-3",
      4: "gap-2.5",
      5: "gap-2",
      6: "gap-1.5",
    }
    return gaps[gridSize]
  }

  useEffect(() => {
    if (gameWon && !gameOver) {
      hapticFeedback.gameWon(settings.hapticFeedback)
      stats.recordWin(score, moveCount, Date.now() - gameStartTime)
      const unlockedAchievements = stats.checkAchievements()
      if (unlockedAchievements.length > 0) {
        setTimeout(() => {
          alert(`Achievement Unlocked: ${unlockedAchievements.map((a) => a.name).join(", ")}`)
        }, 500)
      }
    } else if (gameOver && !gameWon) {
      hapticFeedback.gameOver(settings.hapticFeedback)
      stats.recordLoss()
    }
  }, [gameWon, gameOver])

  const getCurrentGameData = () => ({
    game_state: {
      tiles,
      score,
      bestScore,
      moveCount,
      gridSize,
      gameMode,
    },
    statistics: stats,
    settings,
  })

  const handleLoadCloudData = (data: any) => {
    if (data.game_state) {
      setTiles(data.game_state.tiles || [])
      setScore(data.game_state.score || 0)
      setBestScore(data.game_state.bestScore || 0)
      setMoveCount(data.game_state.moveCount || 0)
      setGridSize(data.game_state.gridSize || 4)
      setGameMode(data.game_state.gameMode || "classic")
    }
    if (data.statistics) {
      setStats(data.statistics)
    }
    setCurrentScreen("game")
  }

  if (currentScreen === "menu") {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br flex items-center justify-center p-4",
          theme.bgGradientFrom,
          theme.bgGradientVia,
          theme.bgGradientTo,
        )}
      >
        <Card className={cn("w-full max-w-2xl p-8 backdrop-blur-lg", theme.cardBg, theme.cardBorder)}>
          <div className="text-center mb-8">
            <h1 className={cn("text-5xl font-bold mb-2", theme.textPrimary)}>2048.Pi</h1>
            <p className={theme.textMuted}>Merge tiles to reach 2048</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className={cn("text-sm mb-3 block", theme.textMuted)}>Game Mode</label>
              <ModeSelector selectedMode={gameMode} onModeSelect={setGameMode} />
            </div>

            <div>
              <label className={cn("text-sm mb-2 block", theme.textMuted)}>Grid Size</label>
              <div className="grid grid-cols-4 gap-2">
                {([3, 4, 5, 6] as GridSize[]).map((size) => (
                  <Button
                    key={size}
                    onClick={() => setGridSize(size)}
                    variant={gridSize === size ? "default" : "outline"}
                    className={cn(
                      gridSize === size
                        ? `${theme.primary} ${theme.primaryHover} ${theme.textPrimary}`
                        : `${theme.secondary} ${theme.secondaryHover} ${theme.textSecondary} ${theme.cardBorder}`,
                    )}
                  >
                    {size}×{size}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setCurrentScreen("game")}
              className={cn(
                "w-full bg-gradient-to-r font-semibold py-6 text-lg",
                theme.accentGradientFrom,
                theme.accentGradientTo,
                theme.textPrimary,
              )}
            >
              Start Game
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setCurrentScreen("stats")}
                variant="outline"
                className={cn(theme.secondary, theme.secondaryHover, theme.textSecondary, theme.cardBorder)}
              >
                <Trophy className="mr-2 h-4 w-4" />
                Statistics
              </Button>
              <Button
                onClick={() => setCurrentScreen("settings")}
                variant="outline"
                className={cn(theme.secondary, theme.secondaryHover, theme.textSecondary, theme.cardBorder)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (currentScreen === "stats") {
    return (
      <StatisticsDashboard onBack={() => setCurrentScreen("menu")}>
        <div className="space-y-4">
          <Button
            onClick={() => setShowCloudSave(!showCloudSave)}
            className={cn("w-full", theme.secondary, theme.secondaryHover)}
          >
            <Cloud className="mr-2 h-5 w-5" />
            Cloud Save
          </Button>

          {showCloudSave && (
            <CloudSavePanel
              onSave={() => {}}
              onLoad={handleLoadCloudData}
              getCurrentGameData={getCurrentGameData}
              theme={theme}
            />
          )}
        </div>
      </StatisticsDashboard>
    )
  }

  if (currentScreen === "history") {
    return (
      <MoveHistoryPanel currentMoves={moveHistory} startTime={gameStartTime} onBack={() => setCurrentScreen("game")} />
    )
  }

  const getAnimationDuration = () => {
    if (settings.reducedMotion) return "duration-0"
    const speeds = {
      slow: "duration-300",
      normal: "duration-150",
      fast: "duration-75",
    }
    return speeds[settings.animationSpeed]
  }

  const undoAvailable = canUndoInMode(gameMode) && undoRedo.canUndo && !gameOver && !gameWon
  const redoAvailable = canUndoInMode(gameMode) && undoRedo.canRedo && !gameOver && !gameWon
  const undoLimit = getUndoLimit(gameMode)
  const undosRemaining = undoLimit === -1 ? Number.POSITIVE_INFINITY : undoLimit - usedUndos

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br flex items-center justify-center p-4",
        theme.bgGradientFrom,
        theme.bgGradientVia,
        theme.bgGradientTo,
      )}
    >
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setCurrentScreen("menu")}
            variant="ghost"
            size="icon"
            className={cn(theme.textPrimary, "hover:bg-white/10")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className={cn("text-4xl font-bold", theme.textPrimary)}>2048.Pi</h1>
          <div className="flex gap-1">
            <Button
              onClick={() => setCurrentScreen("history")}
              variant="ghost"
              size="icon"
              className={cn(theme.textPrimary, "hover:bg-white/10")}
              disabled={moveHistory.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v5h5" />
                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                <path d="M12 7v5l4 2" />
              </svg>
            </Button>
            <Button
              onClick={() => {
                if (settings.confirmExit && (score > 0 || moveCount > 0)) {
                  if (confirm("Start a new game? Current progress will be lost.")) {
                    hapticFeedback.buttonPress(settings.hapticFeedback)
                    initializeGame()
                  }
                } else {
                  hapticFeedback.buttonPress(settings.hapticFeedback)
                  initializeGame()
                }
              }}
              variant="ghost"
              size="icon"
              className={cn(theme.textPrimary, "hover:bg-white/10")}
              title="Quick Restart"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Card className={cn("flex-1 backdrop-blur-sm p-4", theme.cardBg, theme.cardBorder)}>
            <p className={cn("text-xs mb-1", theme.textMuted)}>SCORE</p>
            <p className={cn("text-2xl font-bold", theme.textPrimary)}>{score}</p>
          </Card>
          <Card className={cn("flex-1 backdrop-blur-sm p-4", theme.cardBg, theme.cardBorder)}>
            <p className={cn("text-xs mb-1", theme.textMuted)}>BEST</p>
            <p className={cn("text-2xl font-bold", theme.textPrimary)}>{bestScore}</p>
          </Card>
          {gameMode === "timed" && (
            <Card className={cn("flex-1 backdrop-blur-sm p-4", theme.cardBg, theme.cardBorder)}>
              <p className={cn("text-xs mb-1", theme.textMuted)}>TIME</p>
              <p className={cn("text-2xl font-bold", theme.textPrimary)}>{formatTime(timeElapsed)}</p>
            </Card>
          )}
        </div>

        {canUndoInMode(gameMode) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  hapticFeedback.buttonPress(settings.hapticFeedback)
                  handleUndo()
                }}
                disabled={!undoAvailable}
                variant="outline"
                size="sm"
                className={cn(
                  theme.cardBg,
                  theme.cardBorder,
                  undoAvailable ? `${theme.textPrimary} hover:bg-slate-700` : "text-slate-500 cursor-not-allowed",
                )}
              >
                <Undo className="h-4 w-4 mr-1" />
                Undo {getUndoLimit(gameMode) > 0 && `(${undosRemaining})`}
              </Button>
              <Button
                onClick={() => {
                  hapticFeedback.buttonPress(settings.hapticFeedback)
                  handleRedo()
                }}
                disabled={!redoAvailable}
                variant="outline"
                size="sm"
                className={cn(
                  theme.cardBg,
                  theme.cardBorder,
                  redoAvailable ? `${theme.textPrimary} hover:bg-slate-700` : "text-slate-500 cursor-not-allowed",
                )}
              >
                <Redo className="h-4 w-4 mr-1" />
                Redo
              </Button>
            </div>
            {undoLimit !== -1 && (
              <div className={cn("text-sm", theme.textMuted)}>
                Undos: {undosRemaining}/{undoLimit}
              </div>
            )}
          </div>
        )}

        <Card className={cn("backdrop-blur-sm p-4 mb-4", theme.cardBg, theme.cardBorder)}>
          <div
            className={cn("relative bg-slate-700/50 rounded-lg p-3 grid", getGridGap())}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
              <div key={i} className="bg-slate-600/50 rounded-lg aspect-square" />
            ))}

            {tiles.map((tile) => (
              <div
                key={tile.id}
                className={cn(
                  "absolute flex items-center justify-center font-bold rounded-lg transition-all",
                  getTileSize(),
                  getTileColor(tile.value, theme),
                  getAnimationDuration(),
                  !settings.reducedMotion && tile.isNew && (tile.value <= 4 ? "pop-in" : "bounce-in"),
                  !settings.reducedMotion &&
                    tile.isMerged &&
                    (tile.value >= 512 ? "super-merge" : "zoom-in-110 pulse-glow"),
                  !settings.reducedMotion && tile.value >= 512 && "tile-shimmer",
                  tile.value >= 1024 && "milestone-glow",
                  tile.value === 2048 && !settings.reducedMotion && "celebration-pulse",
                  settings.animationSpeed === "slow" && "tile-transition-slow",
                  settings.animationSpeed === "normal" && "tile-transition",
                  settings.animationSpeed === "fast" && "tile-transition-fast",
                )}
                style={{
                  transform: `translate(${tile.position.col * 100}%, ${tile.position.row * 100}%)`,
                  left: `calc(${(100 / gridSize) * tile.position.col}%)`,
                  top: `calc(${(100 / gridSize) * tile.position.row}%)`,
                  width: `calc(${100 / gridSize}% - ${gridSize === 3 ? "0.75rem" : gridSize === 4 ? "0.625rem" : gridSize === 5 ? "0.5rem" : "0.375rem"})`,
                  height: `calc(${100 / gridSize}% - ${gridSize === 3 ? "0.75rem" : gridSize === 4 ? "0.625rem" : gridSize === 5 ? "0.5rem" : "0.375rem"})`,
                }}
              >
                {tile.value}
              </div>
            ))}
          </div>
        </Card>

        {showAchievementNotification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
            <Card className={cn("p-4 min-w-[250px]", theme.cardBg, theme.cardBorder, theme.primary)}>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <div>
                  <p className={cn("font-semibold text-sm", theme.textPrimary)}>Achievement Unlocked!</p>
                  <p className={cn("text-xs", theme.textSecondary)}>{showAchievementNotification}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <p className={cn("text-center text-sm", theme.textMuted)}>
          {canUndoInMode(gameMode)
            ? "Use Ctrl+Z/Ctrl+Y for undo/redo • Arrow keys to move tiles"
            : "Swipe or use arrow keys to move tiles • Merge tiles to reach 2048"}
        </p>

        {(gameOver || gameWon) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className={cn("w-full max-w-md p-8 text-center", theme.cardBg, theme.cardBorder)}>
              <h2 className={cn("text-3xl font-bold mb-4", theme.textPrimary)}>{gameWon ? "You Won!" : "Game Over"}</h2>
              <p className={cn("mb-2", theme.textMuted)}>Final Score: {score}</p>
              <p className={cn("mb-6", theme.textMuted)}>Moves: {moveCount}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    hapticFeedback.buttonPress(settings.hapticFeedback)
                    initializeGame()
                  }}
                  className={cn("flex-1 bg-gradient-to-r", theme.accentGradientFrom, theme.accentGradientTo)}
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => setCurrentScreen("menu")}
                  variant="outline"
                  className={cn("flex-1", theme.cardBorder, theme.textSecondary, "hover:bg-slate-700")}
                >
                  Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Game2048() {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings())
  const [currentScreen, setCurrentScreen] = useState<"menu" | "game" | "settings" | "stats" | "history">("menu")

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings)
  }

  if (currentScreen === "settings") {
    return (
      <ThemeProvider themeName={settings.theme} settings={settings}>
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onBack={() => setCurrentScreen("menu")}
        />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider themeName={settings.theme} settings={settings}>
      <Game2048Content />
    </ThemeProvider>
  )
}
