"use client"

import { Input } from "@/components/ui/input"
import { Bell, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full mb-6">
      <div className="flex h-16 items-center justify-between glass-card rounded-2xl px-6 py-3 my-4 mx-0 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers, invoices..." 
            className="pl-9 h-10 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 transition-all font-medium text-sm"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
           <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-secondary text-muted-foreground hover:text-foreground">
             <Bell className="h-5 w-5" />
           </Button>
           <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-secondary text-muted-foreground hover:text-foreground">
             <Settings className="h-5 w-5" />
           </Button>
           <div className="h-4 w-[1px] bg-border mx-1" />
           <Button variant="outline" className="rounded-full rounded-2xl border-primary/20 text-primary hover:bg-primary/5 font-semibold text-xs h-9">
              + New Entry
           </Button>
        </div>
      </div>
    </header>
  )
}
