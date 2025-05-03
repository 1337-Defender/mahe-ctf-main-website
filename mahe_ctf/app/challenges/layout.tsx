import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {createClient} from "@/utils/supabase/server";
import {getTeamMemberInfo} from "@/lib/actions";
import { Database } from "@/types/supabase";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const teamMemebrData = await getTeamMemberInfo();

  return (
    <div className="flex flex-1 bg-background">
      <DashboardSidebar teamName={teamMemebrData?.team?.name}/>
      <main className="flex-1 w-full px-4 overflow-y-auto">{children}</main>
    </div>
  )
}