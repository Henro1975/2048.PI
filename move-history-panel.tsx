"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Play, Pause, RotateCcw, ChevronRight, PenIcon as PrevIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import type { MoveRecord } from "@/lib/move-history"
import { getMoveIcon, formatMoveTime } from "@/lib/move-history"

interface MoveHistoryPanelProps {
  currentMoves: MoveRecord[]
  startTime: number
  onBack: () => void
  onReplayMove?: (moveIndex: number) => void
}

export function MoveHistoryPanel({ currentMoves, startTime, onBack, onReplayMove }: MoveHistoryPanelProps) {
  const { theme } = useTheme()
  const [selectedMove, setSelectedMove] = useState<number | null>(null)
  const [isReplaying, setIsReplaying] = useState(false)
  const [replayIndex, setReplayIndex] = useState(0)

  const handleReplay = async () => {
    if (currentMoves.length === 0) return

    setIsReplaying(true)
    setReplayIndex(0)

    for (let i = 0; i < currentMoves.length; i++) {
      setReplayIndex(i)
      if (onReplayMove) {
        onReplayMove(i)
      }
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    setIsReplaying(false)
  }

  const handleStepForward = () => {
    if (replayIndex < currentMoves.length - 1) {
      const nextIndex = replayIndex + 1
      setReplayIndex(nextIndex)
      if (onReplayMove) {
        onReplayMove(nextIndex)
      }
    }
  }

  const handleStepBackward = () => {
    if (replayIndex > 0) {
      const prevIndex = replayIndex - 1
      setReplayIndex(prevIndex)
      if (onReplayMove) {
        onReplayMove(prevIndex)
      }
    }
  }

  const handleReset = () => {
    setReplayIndex(0)
    setIsReplaying(false)
    if (onReplayMove) {
      onReplayMove(0)
    }
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br flex items-center justify-center p-4",
        theme.bgGradientFrom,
        theme.bgGradientVia,
        theme.bgGradientTo,
      )}
    >
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" size="icon" className={cn(theme.textPrimary, "hover:bg-white/10")}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className={cn("text-3xl font-bold", theme.textPrimary)}>Move History</h1>
          <div className="w-10" />
        </div>

        {currentMoves.length === 0 ? (
          <Card className={cn("p-8 text-center backdrop-blur-sm", theme.cardBg, theme.cardBorder)}>
            <p className={theme.textMuted}>No moves yet. Start playing to track your moves!</p>
          </Card>
        ) : (
          <>
            <Card className={cn("p-4 mb-4 backdrop-blur-sm", theme.cardBg, theme.cardBorder)}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={cn("text-sm", theme.textMuted)}>Total Moves</p>
                  <p className={cn("text-2xl font-bold", theme.textPrimary)}>{currentMoves.length}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className={cn(theme.cardBorder, theme.textSecondary)}
                    disabled={isReplaying}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    onClick={handleReplay}
                    variant="default"
                    size="sm"
                    className={cn(theme.primary, theme.primaryHover)}
                    disabled={isReplaying}
                  >
                    {isReplaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    {isReplaying ? "Playing..." : "Replay All"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={handleStepBackward}
                  variant="outline"
                  size="sm"
                  className={cn(theme.cardBorder, theme.textSecondary)}
                  disabled={replayIndex === 0 || isReplaying}
                >
                  <PrevIcon className="h-4 w-4" />
                </Button>
                <div className={cn("px-4 py-2 rounded", theme.cardBg)}>
                  <span className={theme.textPrimary}>
                    Move {replayIndex + 1} / {currentMoves.length}
                  </span>
                </div>
                <Button
                  onClick={handleStepForward}
                  variant="outline"
                  size="sm"
                  className={cn(theme.cardBorder, theme.textSecondary)}
                  disabled={replayIndex === currentMoves.length - 1 || isReplaying}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className={cn("backdrop-blur-sm overflow-hidden", theme.cardBg, theme.cardBorder)}>
              <ScrollArea className="h-[500px]">
                <div className="p-4 space-y-2">
                  {currentMoves.map((move, index) => {
                    const isSelected = selectedMove === index || replayIndex === index
                    return (
                      <div
                        key={move.id}
                        onClick={() => {
                          setSelectedMove(index)
                          setReplayIndex(index)
                          if (onReplayMove) {
                            onReplayMove(index)
                          }
                        }}
                        className={cn(
                          "p-4 rounded-lg cursor-pointer transition-all",
                          isSelected
                            ? `${theme.primary} ${theme.primaryHover}`
                            : `${theme.cardBg} hover:${theme.secondaryHover}`,
                          theme.cardBorder,
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold",
                                theme.secondary,
                              )}
                            >
                              {getMoveIcon(move.direction)}
                            </div>
                            <div>
                              <p className={cn("font-semibold", theme.textPrimary)}>Move #{index + 1}</p>
                              <p className={cn("text-sm", theme.textMuted)}>
                                {formatMoveTime(move.timestamp, startTime)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={cn(
                                "text-lg font-bold",
                                move.scoreChange > 0 ? "text-green-400" : theme.textMuted,
                              )}
                            >
                              {move.scoreChange > 0 ? `+${move.scoreChange}` : move.scoreChange}
                            </p>
                            {move.tilesMerged.length > 0 && (
                              <p className={cn("text-xs", theme.textMuted)}>
                                {move.tilesMerged.length} merge{move.tilesMerged.length > 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>

                        {isSelected && move.tilesMerged.length > 0 && (
                          <div className={cn("mt-3 pt-3 border-t", theme.cardBorder)}>
                            <p className={cn("text-xs mb-2", theme.textMuted)}>Tiles Merged:</p>
                            <div className="flex flex-wrap gap-2">
                              {move.tilesMerged.map((merge, mergeIdx) => (
                                <div key={mergeIdx} className={cn("px-2 py-1 rounded text-xs", theme.secondary)}>
                                  {merge.from.join(" + ")} = {merge.to}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
