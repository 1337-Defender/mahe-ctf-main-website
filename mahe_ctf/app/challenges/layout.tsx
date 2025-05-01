import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 bg-background">
      <DashboardSidebar />
      <main className="flex-1 w-full pl-4 overflow-y-auto">{children}</main>
    </div>
  )
}