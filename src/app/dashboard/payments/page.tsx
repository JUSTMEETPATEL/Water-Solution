"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Plus, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const payments = [
  {
    id: "PAY-001",
    customer: "Rahul Sharma",
    amount: 4500,
    date: "12 Jan 2024",
    status: "Paid",
    method: "UPI",
    ref: "UPI/34567890",
  },
  {
    id: "PAY-002",
    customer: "Priya Patel",
    amount: 3200,
    date: "14 Jan 2024",
    status: "Pending",
    method: "Cash",
    ref: "-",
  },
  {
    id: "PAY-003",
    customer: "Amit Kumar",
    amount: 12000,
    date: "10 Jan 2024",
    status: "Failed",
    method: "Card",
    ref: "TXN_FAILED_09",
  },
  {
    id: "PAY-004",
    customer: "Tech Solutions",
    amount: 25000,
    date: "01 Jan 2024",
    status: "Paid",
    method: "Bank Transfer",
    ref: "NEFT-889977",
  },
   {
    id: "PAY-005",
    customer: "Sneha Gupta",
    amount: 1500,
    date: "15 Jan 2024",
    status: "Paid",
    method: "UPI",
    ref: "UPI/123456",
  },
]

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments</h1>
           <p className="text-muted-foreground">Track financial transactions and invoices.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> Record Payment
        </Button>
      </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bento-card p-5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-primary-foreground/80 font-medium">Total Collected</p>
                   <h3 className="text-3xl font-bold mt-1">₹8,42,000</h3>
                </div>
                <div className="p-2 bg-white/20 rounded-xl">
                   <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
             </div>
             <div className="mt-4 text-sm text-primary-foreground/70 bg-white/10 inline-block px-2 py-1 rounded-lg">
                +12.5% from last month
             </div>
          </div>

          <div className="bento-card p-5">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-muted-foreground font-medium">Pending</p>
                   <h3 className="text-3xl font-bold mt-1 text-orange-600">₹45,200</h3>
                </div>
                 <div className="p-2 bg-orange-100 rounded-xl">
                   <Wallet className="w-6 h-6 text-orange-600" />
                </div>
             </div>
              <p className="text-sm text-muted-foreground mt-4">12 invoices pending</p>
          </div>

          <div className="bento-card p-5">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-muted-foreground font-medium">Failed</p>
                   <h3 className="text-3xl font-bold mt-1 text-red-600">₹12,000</h3>
                </div>
                 <div className="p-2 bg-red-100 rounded-xl">
                   <ArrowDownLeft className="w-6 h-6 text-red-600" />
                </div>
             </div>
              <p className="text-sm text-muted-foreground mt-4">Action required on 3 items</p>
          </div>
       </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bento-card p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, customer..." 
              className="pl-9 rounded-xl bg-secondary/50 border-transparent focus:bg-background transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="rounded-xl border-dashed">
                <Filter className="w-4 h-4 mr-2" /> Filter
             </Button>
              <Button variant="outline" className="rounded-xl border-dashed">
                <Download className="w-4 h-4 mr-2" /> Export
             </Button>
          </div>
      </div>

       {/* Transactions List */}
       <div className="bento-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-secondary/30 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                     <th className="px-6 py-4">Transaction ID</th>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">Method</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="group hover:bg-secondary/20 transition-colors cursor-pointer">
                       <td className="px-6 py-4 font-medium text-foreground">{pay.id}</td>
                       <td className="px-6 py-4">
                          <div className="font-medium">{pay.customer}</div>
                          <div className="text-xs text-muted-foreground">{pay.ref}</div>
                       </td>
                       <td className="px-6 py-4 text-muted-foreground">{pay.date}</td>
                       <td className="px-6 py-4">{pay.method}</td>
                       <td className="px-6 py-4">
                           <Badge 
                            variant="outline" 
                            className={`rounded-full border-0 font-medium ${
                                pay.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                pay.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`}
                          >
                             {pay.status}
                          </Badge>
                       </td>
                       <td className="px-6 py-4 text-right font-bold">
                          ₹{pay.amount.toLocaleString()}
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
