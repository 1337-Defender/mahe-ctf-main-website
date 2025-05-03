"use server"
import { createClient } from "@/utils/supabase/server";

// This is a mock implementation of flag verification
// In a real application, this would verify against a database
export async function verifyFlag(challengeId: string, flag: string): Promise<{ success: boolean }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, let's say flags that contain "correct" are valid
  // In a real app, you'd check against actual flag values in a database
  const isCorrect = flag.toLowerCase().includes("correct")

  return { success: isCorrect }
}

export async function getChallenges(category: string) {
  const supabase = await createClient();
  // let { data, error } = await supabase
  //   .from("challenge")
  //   .select("id, name, description, category, difficulty, points, challenge_link(name, url)")
  //   .eq("category", category)
  //   .order("id", { ascending: true });
  //
  // // Temporarily setting challenges to unsolved
  // data = data?.map(challenge => ({ ...challenge, solved: false })) || []
  let { data, error } = await supabase.rpc("get_challenges_with_details", { tid: 3, cat: category })
  // console.log(data[0].links)
  // console.log(typeof data[0].links)
  // data = data?.map(challenge => {
  //   challenge.links = JSON.parse(challenge.links);
  // }) || []
  return data;
}