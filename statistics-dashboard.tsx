"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Trophy, Target, Clock, Zap, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { loadStats, ACHIEVEMENTS, getAchievementProgress, type GameStats } from "@/lib/statistics"
import { useEffect, useState } from "react"

interface StatisticsDashboardProps {
  onBack: () => void
}

export function StatisticsDashboard({ onBack }: StatisticsDashboardProps) {
  const { theme } = useTheme()
  const [stats, setStats] = useState<GameStats>(loadStats())

  useEffect(() => {
    setStats(loadStats())
  }, [])

  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0

  const avgScore = stats.totalGames > 0 ? Math.round(stats.totalScore / stats.totalGames) : 0

  const avgMoves = stats.totalGames > 0 ? Math.round(stats.totalMoves / stats.totalGames) : 0

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "N/A"
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    } else if (mins > 0) {
      return `${mins}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const achievementProgress = getAchievementProgress(stats)
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => stats.achievementsUnlocked.includes(a.id))
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !stats.achievementsUnlocked.includes(a.id))

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br flex items-center justify-center p-4",
        theme.bgGradientFrom,
        theme.bgGradientVia,
        theme.bgGradientTo,
      )}
    >
      <Card
        className={cn(
          "w-full max-w-4xl p-6 backdrop-blur-lg max-h-[90vh] overflow-y-auto",
          theme.cardBg,
          theme.cardBorder,
        )}
      >
        <div className="flex items-center mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className={cn("mr-2", theme.textMuted, "hover:text-white")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h2 className={cn("text-2xl font-bold", theme.textPrimary)}>Statistics & Achievements</h2>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className={cn("p-4", theme.cardBg, theme.cardBorder)}>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className={cn("h-4 w-4", theme.textMuted)} />
              <p className={cn("text-xs", theme.textMuted)}>Best Score</p>
            </div>
            <p className={cn("text-2xl font-bold", theme.textPrimary)}>{stats.bestScore.toLocaleString()}</p>
          </Card>

          <Card className={cn("p-4", theme.cardBg, theme.cardBorder)}>
            <div className="flex items-center gap-2 mb-2">
              <Target className={cn("h-4 w-4", theme.textMuted)} />
              <p className={cn("text-xs", theme.textMuted)}>Highest Tile</p>
            </div>
            <p className={cn("text-2xl font-bold", theme.textPrimary)}>{stats.highestTile || "N/A"}</p>
          </Card>

          <Card className={cn("p-4", theme.cardBg, theme.cardBorder)}>
            <div className="flex items-center gap-2 mb-2">
              <Zap className={cn("h-4 w-4", theme.textMuted)} />
              <p className={cn("text-xs", theme.textMuted)}>Win Streak</p>
            </div>
            <p className={cn("text-2xl font-bold", theme.textPrimary)}>{stats.bestWinStreak}</p>
          </Card>

          <Card className={cn("p-4", theme.cardBg, theme.cardBorder)}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={cn("h-4 w-4", theme.textMuted)} />
              <p className={cn("text-xs", theme.textMuted)}>Best Time</p>
            </div>
            <p className={cn("text-2xl font-bold", theme.textPrimary)}>{formatTime(stats.bestTime)}</p>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className={cn("text-lg font-semibold mb-3", theme.textPrimary)}>Game Statistics</h3>
            <Card className={cn("p-4 space-y-3", theme.cardBg, theme.cardBorder)}>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Total Games</span>
                <span className={theme.textPrimary}>{stats.totalGames}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Total Wins</span>
                <span className={theme.textPrimary}>{stats.totalWins}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Win Rate</span>
                <span className={theme.textPrimary}>{winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Avg Score</span>
                <span className={theme.textPrimary}>{avgScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Avg Moves/Game</span>
                <span className={theme.textPrimary}>{avgMoves}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Best Moves (to 2048)</span>
                <span className={theme.textPrimary}>{stats.bestMoves > 0 ? stats.bestMoves : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Avg Moves/Win</span>
                <span className={theme.textPrimary}>{stats.avgMovesPerWin > 0 ? stats.avgMovesPerWin : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textSecondary}>Total Play Time</span>
                <span className={theme.textPrimary}>{formatTime(stats.totalPlayTime)}</span>
              </div>
            </Card>
          </div>

          <div>
            <h3 className={cn("text-lg font-semibold mb-3", theme.textPrimary)}>Mode Stats</h3>
            <Card className={cn("p-4 space-y-3", theme.cardBg, theme.cardBorder)}>
              {Object.entries(stats.modeStats).map(([mode, data]) => (
                <div key={mode} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className={cn("font-medium", theme.textPrimary)}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </span>
                    <span className={cn("text-sm", theme.textMuted)}>
                      {data.games} games, {data.wins} wins
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={theme.textSecondary}>Best Score</span>
                    <span className={theme.textSecondary}>{data.bestScore.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>Achievements</h3>
            <div className="flex items-center gap-2">
              <Award className={cn("h-5 w-5", theme.textMuted)} />
              <span className={theme.textSecondary}>
                {achievementProgress.unlocked}/{achievementProgress.total} ({achievementProgress.percentage}%)
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4">
            <div
              className={cn("h-2 rounded-full transition-all", theme.primary)}
              style={{ width: `${achievementProgress.percentage}%` }}
            />
          </div>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-4">
              <h4 className={cn("text-sm font-medium mb-2", theme.textSecondary)}>Unlocked</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {unlockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className={cn("p-3", theme.cardBg, theme.cardBorder)}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h5 className={cn("font-semibold text-sm", theme.textPrimary)}>{achievement.name}</h5>
                        <p className={cn("text-xs", theme.textMuted)}>{achievement.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h4 className={cn("text-sm font-medium mb-2", theme.textSecondary)}>Locked</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className={cn("p-3 opacity-50", theme.cardBg, theme.cardBorder)}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h5 className={cn("font-semibold text-sm", theme.textPrimary)}>{achievement.name}</h5>
                        <p className={cn("text-xs", theme.textMuted)}>{achievement.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
