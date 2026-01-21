"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ShieldCheck, AlertTriangle, Clock, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const amcStats = [
  {
    title: "Active Contracts",
    value: "842",
    icon: ShieldCheck,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Expiring Soon",
    value: "45",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Expired",
    value: "12",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
]

const contracts = [
  {
    id: "AMC-2024-001",
    customer: "Rahul Sharma",
    service: "RO System Repair",
    startDate: "12 Jan 2024",
    endDate: "12 Jan 2025",
    amount: 4500,
    status: "Active",
    progress: 75,
  },
  {
    id: "AMC-2024-002",
    customer: "Priya Patel",
    service: "Water Purifier AMC",
    startDate: "15 Dec 2023",
    endDate: "15 Dec 2024",
    amount: 3200,
    status: "Expiring Soon",
    progress: 92,
  },
  {
    id: "AMC-2024-003",
    customer: "Amit Kumar",
    service: "Plant Maintenance",
    startDate: "10 Nov 2023",
    endDate: "10 Nov 2024",
    amount: 12000,
    status: "Expired",
    progress: 100,
  },
   {
    id: "AMC-2024-004",
    customer: "Tech Solutions Inc",
    service: "Industrial RO AMC",
    startDate: "01 Mar 2024",
    endDate: "01 Mar 2025",
    amount: 25000,
    status: "Active",
    progress: 45,
  },
]

export default function AMCPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">AMC Contracts</h1>
           <p className="text-muted-foreground">Track and manage annual maintenance contracts.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20 bg-primary">
          + Create Contract
        </Button>
      </div>

       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {amcStats.map((stat) => (
             <div key={stat.title} className="bento-card p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                   <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
             </div>
          ))}
       </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bento-card p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search contracts..." 
              className="pl-9 rounded-xl bg-secondary/50 border-transparent focus:bg-background transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="rounded-xl border-dashed">
                <Filter className="w-4 h-4 mr-2" /> Status
             </Button>
              <Button variant="outline" className="rounded-xl border-dashed">
                <Download className="w-4 h-4 mr-2" /> Report
             </Button>
          </div>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {contracts.map((contract) => (
            <div key={contract.id} className="bento-card p-5 flex flex-col gap-4 group">
               <div className="flex justify-between items-start">
                  <div>
                     <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{contract.customer}</h3>
                     <p className="text-sm text-muted-foreground">{contract.service}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`rounded-full border-0 font-medium ${
                        contract.status === 'Active' ? 'bg-green-100 text-green-700' :
                        contract.status === 'Expiring Soon' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                    }`}
                  >
                     {contract.status}
                  </Badge>
               </div>
               
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Progress</span>
                     <span className="font-medium">{contract.progress}%</span>
                  </div>
                  <Progress value={contract.progress} className="h-2 rounded-full" />
               </div>

               <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-4 border-t border-border/50">
                  <div>
                     <p className="text-muted-foreground text-xs">Start Date</p>
                     <p className="font-medium">{contract.startDate}</p>
                  </div>
                   <div className="text-right">
                     <p className="text-muted-foreground text-xs">End Date</p>
                     <p className="font-medium">{contract.endDate}</p>
                  </div>
               </div>
               
               <div className="mt-auto pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl">Details</Button>
                  {contract.status !== 'Active' && (
                     <Button className="flex-1 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground shadow-none">
                        Renew
                     </Button>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  )
}
