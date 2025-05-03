import { ChallengeList } from "@/components/challenge-list"
import { getChallenges as oldGetChallenges } from "@/lib/data"
import { notFound } from "next/navigation"
import {getChallenges} from "@/lib/actions";

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    web: "Web Challenges",
    crypto: "Crypto Challenges",
    forensics: "Forensic Challenges",
    reversing: "Reversing Challenges",
    osint: "OSINT Challenges",
  }
  return labels[category] || category
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = await params;
  const challenges = await getChallenges(category);

  if (!challenges) {
    notFound()
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">{getCategoryLabel(category)}</h1>
      </div>
      <ChallengeList challenges={challenges} category={category} />
    </div>
  )
}
