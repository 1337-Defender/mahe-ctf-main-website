import type { Challenge, TeamStats, CategoryStats } from "./types"

// Mock data for the CTF dashboard
const teamData: TeamStats = {
  name: "Team Hackers",
  score: 2450,
  rank: 5,
  totalTeams: 120,
  solvedChallenges: 12,
  totalChallenges: 35,
  flagsFound: 15,
  totalFlags: 40,
}

const challengesData: Record<string, Challenge[]> = {
  web: [
    {
      id: "web-1",
      name: "Cookie Monster",
      description:
        "The admin portal for this website seems to be using cookies for authentication. Can you find a way to bypass it?",
      difficulty: "easy",
      points: 100,
      category: "web",
      solved: true,
      solvedAt: "2023-05-15 14:30",
      links: [{ name: "Challenge Website", url: "https://example.com/challenge1" }],
      hints: ["Have you checked the cookie values?", "Try manipulating the cookie data"],
    },
    {
      id: "web-2",
      name: "SQL Injection 101",
      description: "This login form seems vulnerable to SQL injection. Can you bypass the authentication?",
      difficulty: "easy",
      points: 150,
      category: "web",
      solved: false,
      links: [{ name: "Challenge Website", url: "https://example.com/challenge2" }],
    },
    {
      id: "web-3",
      name: "XSS Playground",
      description: "This website allows users to post comments. Can you execute JavaScript in another user's browser?",
      difficulty: "medium",
      points: 250,
      category: "web",
      solved: false,
      links: [{ name: "Challenge Website", url: "https://example.com/challenge3" }],
    },
    {
      id: "web-4",
      name: "JWT Cracker",
      description: "The API uses JWT tokens for authentication. Can you forge a valid admin token?",
      difficulty: "hard",
      points: 400,
      category: "web",
      solved: false,
      links: [
        { name: "API Endpoint", url: "https://example.com/api" },
        { name: "Documentation", url: "https://example.com/docs" },
      ],
    },
  ],
  crypto: [
    {
      id: "crypto-1",
      name: "Caesar's Secret",
      description: "Julius Caesar used this cipher to communicate with his generals. Can you decrypt the message?",
      difficulty: "easy",
      points: 100,
      category: "crypto",
      solved: true,
      solvedAt: "2023-05-14 10:15",
      hints: ["The key is a number between 1 and 25", "Try shifting each letter"],
    },
    {
      id: "crypto-2",
      name: "RSA Basics",
      description: "We intercepted an RSA encrypted message and some parameters. Can you decrypt it?",
      difficulty: "medium",
      points: 250,
      category: "crypto",
      solved: true,
      solvedAt: "2023-05-16 18:45",
    },
    {
      id: "crypto-3",
      name: "Hash Collision",
      description: "Find two different inputs that produce the same MD5 hash output.",
      difficulty: "hard",
      points: 350,
      category: "crypto",
      solved: false,
    },
  ],
  forensics: [
    {
      id: "forensics-1",
      name: "Hidden Message",
      description: "There's a hidden message in this image. Can you extract it?",
      difficulty: "easy",
      points: 150,
      category: "forensics",
      solved: true,
      solvedAt: "2023-05-13 09:20",
      links: [{ name: "Download Image", url: "https://example.com/image.jpg" }],
    },
    {
      id: "forensics-2",
      name: "Packet Capture",
      description: "We captured network traffic during an attack. Can you find the malicious payload?",
      difficulty: "medium",
      points: 300,
      category: "forensics",
      solved: false,
      links: [{ name: "Download PCAP", url: "https://example.com/capture.pcap" }],
    },
  ],
  reversing: [
    {
      id: "rev-1",
      name: "Buffer Overflow 101",
      description: "This program has a buffer overflow vulnerability. Can you exploit it to get a shell?",
      difficulty: "medium",
      points: 250,
      category: "rev",
      solved: false,
      links: [
        { name: "Download Binary", url: "https://example.com/program" },
        { name: "Source Code", url: "https://example.com/program.c" },
      ],
    },
    {
      id: "rev-2",
      name: "Return Oriented Programming",
      description: "Bypass ASLR and DEP to exploit this binary using ROP techniques.",
      difficulty: "hard",
      points: 450,
      category: "rev",
      solved: false,
      links: [{ name: "Download Binary", url: "https://example.com/rop-challenge" }],
    },
  ],
  osint: [
    {
      id: "osint-1",
      name: "Forbidden Potion",
      description: "Solve this puzzle to gain access to the forbidden potion.",
      difficulty: "medium",
      points: 200,
      category: "osint",
      solved: true,
      solvedAt: "2023-05-17 11:30",
    },
    {
      id: "osint-2",
      name: "Fortress",
      description: "The pi chart is your best friend. Can you find the fortress?",
      difficulty: "hard",
      points: 350,
      category: "osint",
      solved: false,
      links: [{ name: "Download Program", url: "https://example.com/checker" }],
    },
  ],
}

// Helper functions to get data
export function getTeamStats(): TeamStats {
  return teamData
}

export function getChallenges(category: string): Challenge[] | null {
  return challengesData[category] || null
}

export function getCategoryStats(category: string): CategoryStats {
  const challenges = challengesData[category] || []
  const solved = challenges.filter((c) => c.solved).length

  return {
    solved,
    total: challenges.length,
  }
}
