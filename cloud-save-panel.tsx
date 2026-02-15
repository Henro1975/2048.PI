"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cloud, CloudOff, Download, Upload, Loader2 } from "lucide-react"
import { getCurrentUser, saveGameToCloud, loadGameFromCloud } from "@/lib/supabase"
import { cn } from "@/lib/utils"

interface CloudSavePanelProps {
  onSave: () => void
  onLoad: (data: any) => void
  getCurrentGameData: () => any
  theme: any
}

export function CloudSavePanel({ onSave, onLoad, getCurrentGameData, theme }: CloudSavePanelProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Failed to check user:", error)
    }
  }

  const handleSaveToCloud = async () => {
    if (!user) {
      alert("Please sign in to use cloud save")
      return
    }

    setLoading(true)
    setSyncStatus("saving")

    try {
      const gameData = getCurrentGameData()
      await saveGameToCloud(gameData)
      setLastSyncTime(new Date().toLocaleTimeString())
      setSyncStatus("success")
      setTimeout(() => setSyncStatus("idle"), 2000)
    } catch (error) {
      console.error("Failed to save to cloud:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadFromCloud = async () => {
    if (!user) {
      alert("Please sign in to use cloud save")
      return
    }

    setLoading(true)
    setSyncStatus("loading")

    try {
      const data = await loadGameFromCloud()
      if (data) {
        onLoad(data)
        setLastSyncTime(new Date(data.last_updated).toLocaleTimeString())
        setSyncStatus("success")
        setTimeout(() => setSyncStatus("idle"), 2000)
      } else {
        alert("No cloud save found")
        setSyncStatus("idle")
      }
    } catch (error) {
      console.error("Failed to load from cloud:", error)
      setSyncStatus("error")
      setTimeout(() => setSyncStatus("idle"), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={cn("p-4", theme.cardBg, theme.cardBorder)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Cloud className={cn("h-5 w-5", theme.textPrimary)} />
                <span className={cn("text-sm font-medium", theme.textPrimary)}>Cloud Save</span>
              </>
            ) : (
              <>
                <CloudOff className={cn("h-5 w-5", theme.textMuted)} />
                <span className={cn("text-sm font-medium", theme.textMuted)}>Not Connected</span>
              </>
            )}
          </div>
          {lastSyncTime && <span className={cn("text-xs", theme.textMuted)}>Last sync: {lastSyncTime}</span>}
        </div>

        {user ? (
          <div className="flex gap-2">
            <Button
              onClick={handleSaveToCloud}
              disabled={loading}
              className={cn("flex-1", theme.primary, theme.primaryHover)}
              size="sm"
            >
              {syncStatus === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Save to Cloud
            </Button>
            <Button
              onClick={handleLoadFromCloud}
              disabled={loading}
              className={cn("flex-1", theme.secondary, theme.secondaryHover)}
              size="sm"
            >
              {syncStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Load from Cloud
            </Button>
          </div>
        ) : (
          <p className={cn("text-xs", theme.textMuted)}>Sign in to enable cross-platform sync and cloud backup</p>
        )}

        {syncStatus === "success" && <p className={cn("text-xs text-green-500")}>Sync successful!</p>}
        {syncStatus === "error" && <p className={cn("text-xs text-red-500")}>Sync failed. Please try again.</p>}
      </div>
    </Card>
  )
}
