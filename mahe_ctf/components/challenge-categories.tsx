import Link from "next/link"
import { Compass, Book, Sword, Pickaxe, Skull } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryStats } from "@/lib/data"

const categories = [
  {
    name: "web",
    icon: Compass,
    description: "Explore the vast web realms",
    label: "Web Realms",
  },
  {
    name: "crypto",
    icon: Book,
    description: "Decipher ancient scrolls and codes",
    label: "Cryptic Scrolls",
  },
  {
    name: "forensics",
    icon: Sword,
    description: "Investigate digital artifacts",
    label: "Forensic Quests",
  },
  {
    name: "reversing",
    icon: Pickaxe,
    description: "Mine through binary defenses",
    label: "Binary Mining",
  },
  {
    name: "osint",
    icon: Skull,
    description: "Various challenges for brave adventurers",
    label: "OSINT",
  },
]

export function ChallengeCategories() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const CategoryIcon = category.icon
        const stats = getCategoryStats(category.name)

        return (
          <Link key={category.name} href={`/challenges/${category.name}`}>
            <Card className="hover:bg-stone-800/80 transition-colors cursor-pointer border-4 border-neutral-800 bg-neutral-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-neutral-700">
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <CategoryIcon className="h-5 w-5" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-neutral-400">{category.description}</CardDescription>
                <div className="mt-2 text-sm">
                  <span className="font-medium font-minecraft text-emerald-400">{stats.solved}</span>
                  <span className="text-neutral-400"> / {stats.total} completed</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
