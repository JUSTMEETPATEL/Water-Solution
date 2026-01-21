import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background relative flex">
       {/* Background Effects */}
       <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-chart-2/5 rounded-full blur-[120px]" />
       </div>

       {/* Sidebar */}
       <Sidebar />

       {/* Main Content Area */}
       <main className="flex-1 ml-[calc(1rem+16rem)] p-4 min-h-screen transition-all duration-300">
         <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-2rem)]">
           <Header />
           <div className="flex-1 animate-fade-in">
             {children}
           </div>
         </div>
       </main>
    </div>
  )
}
