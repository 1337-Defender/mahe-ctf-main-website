"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import * as z from "zod";
import {ActionResult} from "next/dist/server/app-render/types";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/challenges");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

interface memberSchema {
  email: string;
  password: string;
  confirmPassword: string;
  registrationNumber: string;
}

// TODO: Fix errors and proper error handling
export const teamSignUpAction = async (formData: any) => {
  let supabaseAdmin;
  const createdUserIds: string[] = [];
  try {
    const teamSize = formData.teamSize;
    const teamName = formData.teamName;
    const members = formData.members;

    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    ;
    supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

    const origin = (await headers()).get("origin");

    const { count: teamUniqueCount, error: teamUniqueError } = await supabaseAdmin
        .from("team")
        .select("*", { count: 'exact', head: true })
        .eq("name", teamName);

    if (teamUniqueCount && teamUniqueCount > 0) {
      return {
        success: false,
        errors: { teamName: "Team name already exists" },
      }
    }

    const createdUsersInfo = [];
    for (let i = 0; i < teamSize; i++) {
      const member = members[i];
      const lowerCaseEmail = member.email.toLowerCase();
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: lowerCaseEmail,
        password: member.password,
        email_confirm: true,
      })

      if (authError) {
          console.error(`Failed to create auth user ${lowerCaseEmail}:`, authError);
          // If email exists, return structured error pointing to the specific member's email field
          if (authError.message.includes('already registered') || authError.message.includes('unique constraint')) {
               // Construct the field name like 'members.0.email', 'members.1.email'
               const fieldName = `members.${i}.email` as keyof ActionResult['errors'];
               return {
                   success: false,
                   errors: { [fieldName]: `Email "${member.email}" is already registered.` }
               };
          }
          // Generic auth error for other issues, harder to map to a field
          throw new Error(`Failed to register member ${member.email}. Please check details and try again.`); // General error
        }
        if (!authData.user) {
           throw new Error(`User data missing for ${lowerCaseEmail} after creation attempt.`); // General error
        }

        console.log(`Successfully created auth user: ${authData.user.email} (ID: ${authData.user.id})`);
        createdUserIds.push(authData.user.id);
        createdUsersInfo.push({ id: authData.user.id, email: authData.user.email! });
    }
    console.log('All Auth users created successfully.');

    // --- 5. Create Team ---
    console.log(`Creating team: ${teamName}`);
    const { data: newTeam, error: teamInsertError } = await supabase
      .from('team')
      .insert({ name: teamName })
      .select('id')
      .single();

    if (teamInsertError || !newTeam) {
      console.error('Failed to insert team:', teamInsertError);
      throw new Error(`Failed to save team details to the database: ${teamInsertError?.message || 'Unknown database error'}`); // General error
    }
    const newTeamId = newTeam.id;
    console.log(`Team created: ${teamName} (ID: ${newTeamId})`);

    // --- 6. Create Team Members ---
    console.log(`Inserting team members for team ID: ${newTeamId}`);
    const membersToInsert = members.map((member: memberSchema) => {
      const userInfo = createdUsersInfo.find(u => u.email.toLowerCase() === member.email.toLowerCase());
      if (!userInfo) throw new Error(`Internal Server Error: Consistency error finding user info for ${member.email}`);
      const registrationNum = parseInt(member.registrationNumber, 10);
      if (isNaN(registrationNum)) throw new Error(`Invalid registration number format for ${member.email}`); // Should be caught by Zod
      return {
        team_id: newTeamId,
        user_id: userInfo.id,
        user_email: userInfo.email,
        registration_number: registrationNum
      };
    });

    const { error: membersInsertError } = await supabase
      .from('team_members')
      .insert(membersToInsert);

    if (membersInsertError) {
      console.error('Failed to insert team members:', membersInsertError);
      throw new Error(`Failed to save team member details to the database: ${membersInsertError.message}`); // General error
    }
    console.log(`Team members successfully added for team ID: ${newTeamId}`);

    // --- 7. Success ---
    return {
        success: true,
        message: `Team "${teamName}" and ${members.length} members registered successfully. Users need to confirm their email.`
    };
  } catch (error: unknown) {
    // Catch block now handles general errors thrown from the try block
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during registration.';
    console.error('Registration process failed:', errorMessage);

    // --- Cleanup Attempt ---
    // (Cleanup logic remains the same)
    if (supabaseAdmin && createdUserIds.length > 0) {
      console.warn(`Attempting to clean up ${createdUserIds.length} created auth users due to error: ${errorMessage}`);
      const cleanupResults = await Promise.allSettled(
        createdUserIds.map(userId => supabaseAdmin.auth.admin.deleteUser(userId))
      );
      cleanupResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Failed to clean up (delete) auth user ${createdUserIds[index]}:`, result.reason);
        } else {
          console.log(`Successfully cleaned up auth user ${createdUserIds[index]}`);
        }
      });
    } else if (!supabaseAdmin) {
        console.error("Supabase admin client not initialized, cannot perform cleanup.");
    } else {
        console.log("No Auth users needed cleanup for this request.");
    }

    // --- Return General Error Response ---
    // Use the general 'error' field for errors caught here
    return {
        success: false,
        // Use _general field or the main error field for non-field specific errors
        errors: { _general: errorMessage },
        error: errorMessage // Keep main error for simpler display if needed
    };
  }

}

const checkEmailExists = async (email: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('check_email_exists', {email_to_check: email});
  if (error) {
    console.error(error.message);
    return false;
  }

  return data;
}