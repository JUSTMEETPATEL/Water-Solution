"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, Download, MoreHorizontal, UserPlus } from "lucide-react"
import { AddCustomerDialog } from "./_components/add-customer-dialog"

type Customer = {
  id: string
  name: string
  phone: string
  email: string | null
  address: string
  createdAt: string
  _count: {
    services: number
    amcs: number
    complaints: number
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  async function fetchCustomers() {
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`)
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [search])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database and service history.</p>
        </div>
        <AddCustomerDialog onSuccess={fetchCustomers} />
      </div>

      {/* Filters */}
      <div className="bento-card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            className="pl-10 rounded-full border-none bg-secondary/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-full flex-1 md:flex-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="rounded-full flex-1 md:flex-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Customer List */}
      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Contact</th>
                <th className="text-left p-4 font-semibold text-muted-foreground hidden lg:table-cell">Services</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">AMC Status</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">No customers found</td>
                </tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-bold text-sm">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {customer.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="font-medium text-foreground">{customer.phone}</p>
                    <p className="text-xs text-muted-foreground">{customer.email || 'No email'}</p>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <p className="font-medium">{customer._count.services} service(s)</p>
                    <p className="text-xs text-muted-foreground">{customer._count.complaints} complaints</p>
                  </td>
                  <td className="p-4">
                    <Badge className={customer._count.amcs > 0 
                      ? "bg-green-100 text-green-700 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }>
                      {customer._count.amcs > 0 ? `${customer._count.amcs} Active` : 'No AMC'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem>Renew AMC</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
