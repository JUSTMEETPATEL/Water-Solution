"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Wrench,
  FileCheck,
  CreditCard,
  MessageSquareWarning,
  PieChart,
  LogOut,
  Settings,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "@/lib/auth-client"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: Wrench,
  },
  {
    title: "AMC Contracts",
    href: "/dashboard/amc",
    icon: FileCheck,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Complaints",
    href: "/dashboard/complaints",
    icon: MessageSquareWarning,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: PieChart,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-64 flex flex-col glass-card dark:border-white/10 rounded-3xl z-50 p-4 transition-all duration-300">
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-4 py-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-lg shadow-primary/20">
          <div className="w-3 h-3 bg-white rounded-full opacity-90" />
        </div>
        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          WaterSol ERP
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-11 rounded-2xl mb-1 text-base font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02]" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-2")} />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="mt-auto pt-4 border-t border-border/50">
         <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
               {session?.user?.image ? (
                 <img src={session.user.image} alt={session.user.name ?? "User"} />
               ) : (
                 <span className="text-sm font-bold text-muted-foreground">
                    {session?.user?.name?.charAt(0) ?? "U"}
                 </span>
               )}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                 {session?.user?.name ?? "Guest User"}
               </p>
               <p className="text-xs text-muted-foreground truncate">
                 {session?.user?.email ?? "Not signed in"}
               </p>
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
         </div>
      </div>
    </aside>
  )
}
