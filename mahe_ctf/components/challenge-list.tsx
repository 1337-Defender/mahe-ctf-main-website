"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChallengeDialog } from "@/components/challenge-dialog"
import type { Challenge } from "@/lib/types"
import { CheckCircle2, Clock, ExternalLink, Eye, Tag } from "lucide-react"

interface ChallengeListProps {
  challenges: Challenge[]
  category: string
}

export function ChallengeList({ challenges, category }: ChallengeListProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [open, setOpen] = useState(false)

  const solvedChallenges = challenges.filter((challenge) => challenge.solved)
  const unsolvedChallenges = challenges.filter((challenge) => !challenge.solved)

  const handleOpenChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setOpen(true)
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
            Easy
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
            Medium
          </Badge>
        )
      case "hard":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
            Hard
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* Unsolved Challenges Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Unsolved Challenges ({unsolvedChallenges.length})</h3>
          </div>

          {unsolvedChallenges.length > 0 ? (
            <div className="space-y-3">
              {unsolvedChallenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-lg">{challenge.name}</h4>
                          <Badge variant="outline" className="bg-primary/5">
                            {challenge.points} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
                        <div className="flex items-center gap-2 pt-1">
                          {getDifficultyBadge(challenge.difficulty)}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenChallenge(challenge)}
                          className="h-8 gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                        {challenge.links && challenge.links.length > 0 && (
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" asChild>
                            <a href={challenge.links[0].url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Open challenge</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-muted/50 p-8 text-center">
              <p className="text-muted-foreground">No unsolved challenges in this category.</p>
            </div>
          )}
        </div>

        {/* Solved Challenges Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-xl font-semibold">Solved Challenges ({solvedChallenges.length})</h3>
          </div>

          {solvedChallenges.length > 0 ? (
            <div className="space-y-3">
              {solvedChallenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="overflow-hidden hover:shadow-md transition-shadow bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-lg">{challenge.name}</h4>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                            {challenge.points} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                          {getDifficultyBadge(challenge.difficulty)}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {category}
                          </span>
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Solved on {challenge.solvedAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenChallenge(challenge)}
                          className="h-8 gap-1 border-green-200 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border bg-muted/50 p-8 text-center">
              <p className="text-muted-foreground">No solved challenges in this category yet.</p>
            </div>
          )}
        </div>
      </div>

      {selectedChallenge && (
        <ChallengeDialog challenge={selectedChallenge} open={open} onOpenChange={setOpen} category={category} />
      )}
    </>
  )
}
