export interface Challenge {
  id: string
  name: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  points: number
  category: string
  solved: boolean
  solvedAt?: string
  hints?: string[]
  links?: {
    name: string
    url: string
  }[]
}

export interface TeamStats {
  name: string
  score: number
  rank: number
  totalTeams: number
  solvedChallenges: number
  totalChallenges: number
  flagsFound: number
  totalFlags: number
}

export interface CategoryStats {
  solved: number
  total: number
}