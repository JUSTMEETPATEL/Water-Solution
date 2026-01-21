import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Gradient Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 via-chart-4/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-chart-2/5 via-primary/3 to-transparent rounded-full blur-3xl" />
      </div>

      <Sidebar />
      <main className="ml-72 min-h-screen">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
