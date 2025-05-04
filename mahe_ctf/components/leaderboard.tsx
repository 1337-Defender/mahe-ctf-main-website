"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Medal, Crown } from "lucide-react"
import {LeaderboardStats} from "@/lib/types";

interface LeaderboardProps {
    leaderboard: LeaderboardStats[]
}

export function Leaderboard({ leaderboard }: LeaderboardProps) {
  const leaderboardData = leaderboard
  console.log(leaderboardData)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"score" | "rank" | "team_name">("rank")

  // Filter teams based on search query
  const filteredTeams = leaderboardData.filter((team) =>
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort teams based on selected criteria
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score
    if (sortBy === "rank") return a.rank - b.rank
    return a.team_name.localeCompare(b.team_name)
  })

  // Extract top 3 teams for podium (based on rank)
  const topTeams = sortedTeams.filter((team) => team.rank <= 3).sort((a, b) => a.rank - b.rank)

  // Rest of the teams (4th place and below)
  const remainingTeams = sortedTeams.filter((team) => team.rank > 3)

  // Check if we have enough teams for a podium
  const showPodium = topTeams.length >= 3 && searchQuery === ""

  // Get team by rank for podium display
  const getTeamByRank = (rank: number) => {
    return topTeams.find((team) => team.rank === rank)
  }
// Check if specific ranks exist
  const hasFirstPlace = !!getTeamByRank(1)
  const hasSecondPlace = !!getTeamByRank(2)
  const hasThirdPlace = !!getTeamByRank(3)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Sort by Rank</SelectItem>
              <SelectItem value="score">Sort by Score</SelectItem>
              <SelectItem value="team_name">Sort by Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Podium for Top Teams */}
      {showPodium && (
        <div className="relative h-[280px] md:h-[320px] mt-8 mb-12">
          {/* Second Place - Left */}
          {hasSecondPlace && (
            <div className="absolute left-0 bottom-0 w-[30%] md:w-[32%]">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center overflow-hidden">
                    <span className="text-xl md:text-2xl font-bold">
                      {getTeamByRank(2)?.team_name.charAt(0) || "?"}
                    </span>
                  </div>
                  <Medal className="absolute -bottom-1 -right-1 h-7 w-7 text-gray-400" />
                </div>
                <h3 className="mt-2 font-semibold text-center text-sm md:text-base truncate max-w-full">
                  {getTeamByRank(2)?.team_name || "Team"}
                </h3>
                <div className="text-lg md:text-xl font-bold text-gray-700">{getTeamByRank(2)?.score || 0}</div>
                <div className="text-xs text-muted-foreground">points</div>
                <div className="h-[100px] md:h-[140px] w-full bg-gray-200 dark:bg-gray-800 mt-3 rounded-t-lg flex items-end justify-center">
                  <div className="text-lg font-bold pb-2">2</div>
                </div>
              </div>
            </div>
          )}

          {/* First Place - Center */}
          {hasFirstPlace && (
            <div
              className={`absolute ${!hasSecondPlace && !hasThirdPlace ? "left-1/2 -translate-x-1/2" : hasSecondPlace || hasThirdPlace ? "left-1/2 -translate-x-1/2" : "left-1/4 -translate-x-1/2"} bottom-0 w-[30%] md:w-[32%] z-10`}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl md:text-3xl font-bold">
                      {getTeamByRank(1)?.team_name.charAt(0) || "?"}
                    </span>
                  </div>
                  <Crown className="absolute -bottom-1 -right-1 h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="mt-2 font-bold text-center text-base md:text-lg truncate max-w-full">
                  {getTeamByRank(1)?.team_name || "Team"}
                </h3>
                <div className="text-xl md:text-2xl font-bold text-yellow-600">{getTeamByRank(1)?.score || 0}</div>
                <div className="text-xs text-muted-foreground">points</div>
                <div className="h-[140px] md:h-[180px] w-full bg-yellow-100 dark:bg-yellow-900/30 mt-3 rounded-t-lg flex items-end justify-center">
                  <div className="text-xl font-bold pb-2">1</div>
                </div>
              </div>
            </div>
          )}

          {/* Third Place - Right */}
          {hasThirdPlace && (
            <div className="absolute right-0 bottom-0 w-[30%] md:w-[32%]">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-amber-100 border-4 border-amber-700 flex items-center justify-center overflow-hidden">
                    <span className="text-lg md:text-xl font-bold">{getTeamByRank(3)?.team_name.charAt(0) || "?"}</span>
                  </div>
                  <Medal className="absolute -bottom-1 -right-1 h-6 w-6 text-amber-700" />
                </div>
                <h3 className="mt-2 font-medium text-center text-xs md:text-sm truncate max-w-full">
                  {getTeamByRank(3)?.team_name || "Team"}
                </h3>
                <div className="text-base md:text-lg font-bold text-amber-700">{getTeamByRank(3)?.score || 0}</div>
                <div className="text-xs text-muted-foreground">points</div>
                <div className="h-[80px] md:h-[120px] w-full bg-amber-100 dark:bg-amber-900/30 mt-3 rounded-t-lg flex items-end justify-center">
                  <div className="text-lg font-bold pb-2">3</div>
                </div>
              </div>
            </div>
          )}

          {/* Special case for only 2 teams - adjust positioning */}
          {hasFirstPlace && hasSecondPlace && !hasThirdPlace && (
            <div className="absolute right-0 bottom-0 w-[30%] md:w-[32%] opacity-0">
              <div className="h-[80px] md:h-[120px] w-full"></div>
            </div>
          )}
        </div>
      )}

      {/* Remaining Teams List */}
      {(remainingTeams.length > 0 || !showPodium) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            {showPodium && remainingTeams.length > 0 ? "Other Teams" : "All Teams"} (
            {showPodium ? remainingTeams.length : sortedTeams.length})
          </h3>

          {/* Show remaining teams if podium is visible, otherwise show all teams */}
          {(showPodium ? remainingTeams : sortedTeams).map((team) => {
            const isCurrentTeam = team.team_name === "Team Hackers"

            return (
              <Card
                key={team.team_id}
                className={`overflow-hidden hover:shadow-md transition-shadow ${
                  isCurrentTeam ? "border-blue-200 bg-blue-50 dark:bg-blue-950/10 dark:border-blue-900/30" : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-4 gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <span className="font-semibold">{team.rank}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg truncate">{team.team_name}</h3>
                        {isCurrentTeam && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                            Your Team
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>Last solve: {`${new Date(team.last_solve_timestamp).toLocaleString()}`}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">{team.score}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {sortedTeams.length === 0 && (
            <div className="rounded-md border bg-muted/50 p-8 text-center">
              <p className="text-muted-foreground">No teams found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state when no teams are available */}
      {sortedTeams.length === 0 && (
        <div className="rounded-md border bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">No teams found matching your search.</p>
        </div>
      )}
    </div>
  )
}
