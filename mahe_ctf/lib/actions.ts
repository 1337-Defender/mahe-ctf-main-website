"use server"
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";
import {revalidatePath} from "next/cache";

// This is a mock implementation of flag verification
// In a real application, this would verify against a database
// export async function verifyFlag(challengeId: string, flag: string): Promise<{ success: boolean }> {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//
//   // For demo purposes, let's say flags that contain "correct" are valid
//   // In a real app, you'd check against actual flag values in a database
//   const isCorrect = flag.toLowerCase().includes("correct")
//
//   return { success: isCorrect }
// }

export async function verifyFlag(challenge_id: number, team_id: number,
                                  submitted_flag: string) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  const { data: result, error: rpcError } = await supabase.rpc(
      'submit_challenge_flag',
      {challenge_id_param: challenge_id, team_id_param: team_id, user_id_param: user.user?.id, submitted_flag: submitted_flag},
  );

  if (rpcError) { console.log(rpcError);/* handle error */ return { success: false, message: 'RPC Error' }; }
  console.log(result);

  if (result === 'SUCCESS') {
      // Revalidate the specific category page
      // You need the category name here. Pass it as an argument to the action if needed.
      const categoryName = 'web'; // Example: Replace with actual category
      revalidatePath(`/challenges/${categoryName}`);
      // Optionally revalidate other paths like dashboard home
      // revalidatePath('/dashboard');
      return { success: true, message: 'Correct flag!' };
  } else if (result === 'ALREADY_SOLVED') {
      return { success: false, message: 'Challenge already solved by your team! Please refresh the page.' };
  } else if (result === 'WRONG_FLAG') {
      return { success: false, message: 'Incorrect flag.' };
  } else {
      // Handle other statuses like CHALLENGE_NOT_FOUND, errors etc.
      return { success: false, message: 'Submission failed.' };
  }
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

// TODO: Fix types
export async function getTeamMemberInfo() {
  const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const { data: teamMemberData, error: teamMemberError } = await supabase
        .from("team_members")
        .select("user_email, registration_number, team(*)")
        .eq("user_id", userData?.user?.id)
        .single();

    return teamMemberData;
}