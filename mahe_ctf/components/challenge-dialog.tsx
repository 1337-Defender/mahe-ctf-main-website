"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import type { Challenge } from "@/lib/types"
import { verifyFlag } from "@/lib/actions"

interface ChallengeDialogProps {
  challenge: Challenge
  open: boolean
  onOpenChange: (open: boolean) => void
  category: string
}

export function ChallengeDialog({ challenge, open, onOpenChange, category }: ChallengeDialogProps) {
  const [flag, setFlag] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!flag.trim()) return

    setStatus("submitting")

    try {
      const result = await verifyFlag(challenge.id, flag)

      if (result.success) {
        setStatus("success")
        setMessage("Flag is correct! Challenge solved.")
      } else {
        setStatus("error")
        setMessage("Incorrect flag. Try again.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred. Please try again.")
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{challenge.name}</DialogTitle>
            <Badge variant="outline" className="bg-primary/10">
              {challenge.points} pts
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {getDifficultyBadge(challenge.difficulty)}
            <DialogDescription>Category: {category}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>

          {challenge.links && challenge.links.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Resources</h4>
              <div className="flex flex-wrap gap-2">
                {challenge.links.map((link, index) => (
                  <Button key={index} variant="outline" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      {link.name} <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {challenge.hints && challenge.hints.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Hints</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {challenge.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Separator />

        {challenge.solved ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className="font-medium text-green-700 dark:text-green-400">Challenge Solved!</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1">You solved this challenge on {challenge.solvedAt}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="flag">Submit Flag</Label>
                <div className="flex gap-2">
                  <Input
                    id="flag"
                    placeholder="flag{...}"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    disabled={status === "submitting" || status === "success"}
                  />
                  <Button type="submit" disabled={status === "submitting" || status === "success"}>
                    {status === "submitting" ? "Checking..." : "Submit"}
                  </Button>
                </div>
                {status !== "idle" && (
                  <div
                    className={`text-sm flex items-center gap-2 mt-2 ${
                      status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : ""
                    }`}
                  >
                    {status === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : status === "error" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : null}
                    <span>{message}</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
