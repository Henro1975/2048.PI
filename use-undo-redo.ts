"use client"

import { useState, useCallback } from "react"

export interface GameState<T> {
  state: T
  timestamp: number
}

export function useUndoRedo<T>(initialState: T, maxHistorySize = 50) {
  const [history, setHistory] = useState<GameState<T>[]>([{ state: initialState, timestamp: Date.now() }])
  const [currentIndex, setCurrentIndex] = useState(0)

  const pushState = useCallback(
    (newState: T) => {
      setHistory((prev) => {
        // Remove any states after current index (in case we undid and then made a new move)
        const newHistory = prev.slice(0, currentIndex + 1)

        // Add new state
        newHistory.push({ state: newState, timestamp: Date.now() })

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          return newHistory.slice(newHistory.length - maxHistorySize)
        }

        return newHistory
      })

      setCurrentIndex((prev) => {
        const newIndex = prev + 1
        return newIndex >= maxHistorySize ? maxHistorySize - 1 : newIndex
      })
    },
    [currentIndex, maxHistorySize],
  )

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      return history[currentIndex - 1].state
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return history[currentIndex + 1].state
    }
    return null
  }, [currentIndex, history])

  const reset = useCallback((newInitialState: T) => {
    setHistory([{ state: newInitialState, timestamp: Date.now() }])
    setCurrentIndex(0)
  }, [])

  const getCurrentState = useCallback(() => {
    return history[currentIndex]?.state || initialState
  }, [currentIndex, history, initialState])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1
  const historySize = history.length
  const undoCount = currentIndex
  const redoCount = history.length - currentIndex - 1

  return {
    pushState,
    undo,
    redo,
    reset,
    getCurrentState,
    canUndo,
    canRedo,
    historySize,
    undoCount,
    redoCount,
    history,
    currentIndex,
  }
}
