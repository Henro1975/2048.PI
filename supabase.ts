import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export interface CloudSaveData {
  user_id: string
  game_state: {
    tiles: any[]
    score: number
    bestScore: number
    moveCount: number
    gridSize: number
    gameMode: string
  }
  statistics: any
  settings: any
  last_updated: string
}

export const saveGameToCloud = async (data: Omit<CloudSaveData, "user_id" | "last_updated">) => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { error } = await supabase.from("game_saves").upsert({
    user_id: user.id,
    ...data,
    last_updated: new Date().toISOString(),
  })

  if (error) throw error
}

export const loadGameFromCloud = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("game_saves").select("*").eq("user_id", user.id).single()

  if (error && error.code !== "PGRST116") throw error

  return data
}

export const getCurrentUser = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
