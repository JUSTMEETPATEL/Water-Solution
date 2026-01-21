"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MessageSquareWarning, CheckCircle2, Clock, Plus, UserCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const complaints = [
  {
    id: "TIC-001",
    customer: "Rahul Sharma",
    issue: "RO Not Working",
    desc: "Water flow is very slow since yesterday morning.",
    status: "Open",
    date: "Today, 10:30 AM",
    technician: null,
    priority: "High",
  },
  {
    id: "TIC-002",
    customer: "Priya Patel",
    issue: "Filter Change",
    desc: "Regular filter cleanup and maintenance due.",
    status: "In Progress",
    date: "Yesterday",
    technician: "Vikram Singh",
    priority: "Medium",
  },
  {
    id: "TIC-003",
    customer: "Amit Kumar",
    issue: "Leakage Found",
    desc: "Water leaking from the bottom unit.",
    status: "Resolved",
    date: "12 Jan 2024",
    technician: "Vikram Singh",
    priority: "High",
  },
  {
    id: "TIC-004",
    customer: "Sneha Gupta",
    issue: "Installation",
    desc: "New unit installation request.",
    status: "Open",
    date: "10 Jan 2024",
    technician: null,
    priority: "Low",
  },
]

export default function ComplaintsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Complaints & Requests</h1>
           <p className="text-muted-foreground">Manage support tickets and service requests.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20 bg-destructive hover:bg-destructive/90 text-white">
          <Plus className="w-4 h-4 mr-2" /> Log Complaint
        </Button>
      </div>

       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bento-card p-4 flex items-center gap-4 border-l-4 border-l-red-500">
             <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
                 <MessageSquareWarning className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                <h3 className="text-2xl font-bold">5</h3>
             </div>
          </div>
          <div className="bento-card p-4 flex items-center gap-4 border-l-4 border-l-orange-500">
             <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                 <Clock className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold">3</h3>
             </div>
          </div>
          <div className="bento-card p-4 flex items-center gap-4 border-l-4 border-l-green-500">
             <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                 <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                <h3 className="text-2xl font-bold">8</h3>
             </div>
          </div>
       </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bento-card p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ticket ID, customer..." 
              className="pl-9 rounded-xl bg-secondary/50 border-transparent focus:bg-background transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="rounded-xl border-dashed">
                <Filter className="w-4 h-4 mr-2" /> Status
             </Button>
             <Button variant="outline" className="rounded-xl border-dashed">
                <UserCircle className="w-4 h-4 mr-2" /> Technician
             </Button>
          </div>
      </div>

       {/* Complaints List - Card Style */}
       <div className="grid grid-cols-1 gap-4">
         {complaints.map((ticket) => (
             <div key={ticket.id} className="bento-card p-5 hover:border-primary/50 transition-colors group">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                   <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-600' :
                          ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                      }`}>
                          <MessageSquareWarning className="w-5 h-5" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{ticket.issue}</h3>
                            <Badge variant="outline" className="text-xs rounded-md">{ticket.id}</Badge>
                         </div>
                         <p className="text-muted-foreground mt-1 max-w-xl">{ticket.desc}</p>
                         <div className="flex items-center gap-4 mt-3 text-sm">
                             <span className="font-medium text-foreground flex items-center gap-1">
                                <UserCircle className="w-4 h-4 text-muted-foreground" />
                                {ticket.customer}
                             </span>
                             <span className="text-muted-foreground text-xs">•</span>
                             <span className="text-muted-foreground">{ticket.date}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                       <Badge 
                            variant="outline" 
                            className={`rounded-full border-0 font-medium px-3 py-1 ${
                                ticket.status === 'Open' ? 'bg-red-100 text-red-700' :
                                ticket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                            }`}
                        >
                             {ticket.status}
                        </Badge>
                        
                        {ticket.technician ? (
                            <div className="flex items-center gap-2 text-sm bg-secondary/50 px-3 py-1.5 rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-medium">{ticket.technician}</span>
                            </div>
                        ) : (
                             <Button size="sm" variant="outline" className="rounded-lg h-8 border-dashed text-muted-foreground">
                                + Assign Technician
                             </Button>
                        )}
                        
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="ghost" size="sm" className="flex-1 md:flex-none">Details</Button>
                            {ticket.status !== 'Resolved' && (
                                <Button size="sm" className="flex-1 md:flex-none rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                    Resolve
                                </Button>
                            )}
                        </div>
                   </div>
                </div>
             </div>
         ))}
       </div>
    </div>
  )
}
