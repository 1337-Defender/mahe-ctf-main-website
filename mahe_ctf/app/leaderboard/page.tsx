import React from 'react';
import {getLeaderboard} from "@/lib/actions";
import {Leaderboard} from "@/components/leaderboard";

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <p className="text-muted-foreground">Current standings for all teams in the competition</p>
      <Leaderboard leaderboard={leaderboard} />
    </div>
  )
}