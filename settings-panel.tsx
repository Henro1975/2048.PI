"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, Volume2, Zap, Eye, Accessibility } from "lucide-react"
import type { GameSettings, Theme, AnimationSpeed } from "@/lib/game-settings"

interface SettingsPanelProps {
  settings: GameSettings
  onSettingsChange: (settings: GameSettings) => void
  onBack: () => void
}

export function SettingsPanel({ settings, onSettingsChange, onBack }: SettingsPanelProps) {
  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 bg-slate-800/50 backdrop-blur-lg border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" size="icon" className="mr-2 text-slate-400 hover:text-white">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
        </div>

        <div className="space-y-6">
          {/* Display Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Display</h3>
            </div>

            <div className="space-y-4 pl-7">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["default", "dark", "ocean", "forest", "neon", "nature", "minimalist"] as Theme[]).map((theme) => (
                    <Button
                      key={theme}
                      onClick={() => updateSetting("theme", theme)}
                      variant={settings.theme === theme ? "default" : "outline"}
                      className={
                        settings.theme === theme
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
                      }
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Animation Speed</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["slow", "normal", "fast"] as AnimationSpeed[]).map((speed) => (
                    <Button
                      key={speed}
                      onClick={() => updateSetting("animationSpeed", speed)}
                      variant={settings.animationSpeed === speed ? "default" : "outline"}
                      className={
                        settings.animationSpeed === speed
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
                      }
                    >
                      {speed.charAt(0).toUpperCase() + speed.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Show grid numbers</label>
                <Switch
                  checked={settings.showGridNumbers}
                  onCheckedChange={(checked) => updateSetting("showGridNumbers", checked)}
                />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Volume2 className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Audio</h3>
            </div>

            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Sound effects</label>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Background music</label>
                <Switch
                  checked={settings.musicEnabled}
                  onCheckedChange={(checked) => updateSetting("musicEnabled", checked)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Volume: {settings.volume}%</label>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([value]) => updateSetting("volume", value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Gameplay Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Gameplay</h3>
            </div>

            <div className="space-y-4 pl-7">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Swipe sensitivity: {settings.swipeSensitivity}%
                  <span className="text-xs text-slate-500 ml-2">
                    (
                    {settings.swipeSensitivity < 40
                      ? "Very Easy"
                      : settings.swipeSensitivity < 60
                        ? "Easy"
                        : settings.swipeSensitivity < 80
                          ? "Normal"
                          : "Hard"}
                    )
                  </span>
                </label>
                <Slider
                  value={[settings.swipeSensitivity]}
                  onValueChange={([value]) => updateSetting("swipeSensitivity", value)}
                  min={20}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Lower = easier to swipe, Higher = more precise control needed
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-slate-300">Haptic feedback</label>
                  <p className="text-xs text-slate-500">Vibration on tile moves & merges</p>
                </div>
                <Switch
                  checked={settings.hapticFeedback}
                  onCheckedChange={(checked) => updateSetting("hapticFeedback", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-slate-300">Confirm before restart</label>
                  <p className="text-xs text-slate-500">Ask before starting a new game</p>
                </div>
                <Switch
                  checked={settings.confirmExit}
                  onCheckedChange={(checked) => updateSetting("confirmExit", checked)}
                />
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Accessibility className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Accessibility</h3>
            </div>

            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">High contrast mode</label>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-300">Reduced motion</label>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Font size</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["normal", "large"] as const).map((size) => (
                    <Button
                      key={size}
                      onClick={() => updateSetting("fontSize", size)}
                      variant={settings.fontSize === size ? "default" : "outline"}
                      className={
                        settings.fontSize === size
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
                      }
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-slate-700">
            <Button
              onClick={() => {
                if (confirm("Reset all settings to default?")) {
                  const { DEFAULT_SETTINGS } = require("@/lib/game-settings")
                  onSettingsChange(DEFAULT_SETTINGS)
                }
              }}
              variant="outline"
              className="w-full border-red-600 text-red-400 hover:bg-red-950/20"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
