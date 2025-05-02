"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flag, Home, Lock, Network, Shield, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "web", icon: Network },
  { name: "crypto", icon: Lock },
  { name: "forensics", icon: Shield },
  { name: "reversing", icon: Terminal },
  { name: "osint", icon: Flag },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-muted/40 h-[calc(100vh-4rem)] sticky top-0">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold">CTF Dashboard</h2>
        </div>
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Overview</h3>
          <div className="space-y-1">
            <Button
              variant={pathname === "/challenges" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/challenges">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const CategoryIcon = category.icon
              const isActive = pathname === `/challenges/${category.name}`

              return (
                <Button
                  key={category.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start capitalize"
                  asChild
                >
                  <Link href={`/challenges/${category.name}`}>
                    <CategoryIcon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              T
            </div>
            <div className="text-sm font-medium">Team Hackers</div>
          </div>
        </div>
      </div>
    </div>
  )
}
