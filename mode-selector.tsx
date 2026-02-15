"use client"

import { Card } from "@/components/ui/card"
import { GAME_MODES, type GameMode } from "@/lib/game-settings"
import { cn } from "@/lib/utils"

interface ModeSelectorProps {
  selectedMode: GameMode
  onModeSelect: (mode: GameMode) => void
  className?: string
}

export function ModeSelector({ selectedMode, onModeSelect, className }: ModeSelectorProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
      {GAME_MODES.map((mode) => {
        const isSelected = selectedMode === mode.id

        return (
          <button
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            className={cn("text-left transition-all", isSelected && "ring-2 ring-purple-500")}
          >
            <Card
              className={cn(
                "p-4 cursor-pointer transition-all hover:scale-[1.02]",
                isSelected
                  ? "bg-purple-600/20 border-purple-500"
                  : "bg-slate-700/50 border-slate-600 hover:bg-slate-700",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{mode.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{mode.name}</h3>
                  <p className="text-sm text-slate-400 mb-2">{mode.description}</p>

                  {mode.features.customRules && (
                    <div className="text-xs bg-slate-800/50 rounded px-2 py-1 text-purple-300">
                      {mode.features.customRules}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {mode.features.hasUndo && (
                      <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded">Undo available</span>
                    )}
                    {mode.features.hasTimeLimit && (
                      <span className="text-xs bg-orange-900/30 text-orange-300 px-2 py-0.5 rounded">Time limit</span>
                    )}
                    {mode.features.hasScoreGoal && (
                      <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">Score goal</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </button>
        )
      })}
    </div>
  )
}
