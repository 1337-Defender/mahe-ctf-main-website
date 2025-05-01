import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTeamStats } from "@/lib/data"

export function TeamStats() {
  const stats = getTeamStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.score} pts</div>
          <p className="text-xs text-muted-foreground">
            Ranked #{stats.rank} of {stats.totalTeams}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Challenges Solved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.solvedChallenges}</div>
          <p className="text-xs text-muted-foreground">of {stats.totalChallenges} challenges</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Flags Found</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.flagsFound}</div>
          <p className="text-xs text-muted-foreground">of {stats.totalFlags} flags</p>
        </CardContent>
      </Card>
    </div>
  )
}
