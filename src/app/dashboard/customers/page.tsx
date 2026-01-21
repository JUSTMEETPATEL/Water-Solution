"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreVertical, Filter, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const customers = [
  {
    id: "CUST-001",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@example.com",
    address: "B-402, Galaxy Heights, Mumbai",
    services: 2,
    amcStatus: "Active",
    lastService: "12 Jan 2024",
    balance: 0,
  },
  {
    id: "CUST-002",
    name: "Priya Patel",
    phone: "+91 98989 89898",
    email: "priya.p@example.com",
    address: "12, Ambika Bunglows, Ahmedabad",
    services: 1,
    amcStatus: "Expiring Soon",
    lastService: "15 Dec 2023",
    balance: 4500,
  },
  {
    id: "CUST-003",
    name: "Amit Kumar",
    phone: "+91 76543 21098",
    email: "amit.k@example.com",
    address: "Flat 101, Shanti Niketan, Delhi",
    services: 3,
    amcStatus: "Expired",
    lastService: "10 Nov 2023",
    balance: 0,
  },
  {
    id: "CUST-004",
    name: "Sneha Gupta",
    phone: "+91 87654 32109",
    email: "sneha.g@example.com",
    address: "C-20, Green Park, Bangalore",
    services: 1,
    amcStatus: "Active",
    lastService: "05 Feb 2024",
    balance: 0,
  },
]

import { AddCustomerDialog } from "./_components/add-customer-dialog"

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
           <p className="text-muted-foreground">Manage your customer base and their services.</p>
        </div>
        <AddCustomerDialog />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bento-card p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, phone or email..." 
              className="pl-9 rounded-xl bg-secondary/50 border-transparent focus:bg-background transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <Button variant="outline" className="rounded-xl border-dashed">
                <Filter className="w-4 h-4 mr-2" /> Filter
             </Button>
             <Button variant="outline" className="rounded-xl border-dashed">
                <Download className="w-4 h-4 mr-2" /> Export
             </Button>
          </div>
      </div>

      {/* Bento Table */}
      <div className="bento-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-secondary/30 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Contact</th>
                     <th className="px-6 py-4">AMC Status</th>
                     <th className="px-6 py-4">Last Service</th>
                     <th className="px-6 py-4">Balance</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="group hover:bg-secondary/20 transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center text-primary font-bold">
                                {customer.name.charAt(0)}
                             </div>
                             <div>
                                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{customer.name}</div>
                                <div className="text-xs text-muted-foreground">{customer.id}</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-foreground">{customer.phone}</div>
                          <div className="text-xs text-muted-foreground">{customer.email}</div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={`rounded-full border-0 font-medium ${
                                customer.amcStatus === 'Active' ? 'bg-green-100 text-green-700' :
                                customer.amcStatus === 'Expiring Soon' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`}
                          >
                             {customer.amcStatus}
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-muted-foreground">
                          {customer.lastService}
                       </td>
                       <td className="px-6 py-4">
                          <span className={customer.balance > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                             {customer.balance > 0 ? `-₹${customer.balance}` : "Paid"}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                                   <MoreVertical className="w-4 h-4" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                <DropdownMenuItem>Renew AMC</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
