"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Wrench, Settings, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const services = [
  {
    id: "SRV-001",
    type: "RO Installation",
    price: 1500,
    duration: "2 hours",
    warranty: "1 Year",
    status: "Active",
  },
  {
    id: "SRV-002",
    type: "Filter Replacement",
    price: 800,
    duration: "45 mins",
    warranty: "3 Months",
    status: "Active",
  },
  {
    id: "SRV-003",
    type: "Full Maintenance",
    price: 2500,
    duration: "3 hours",
    warranty: "6 Months",
    status: "Active",
  },
   {
    id: "SRV-004",
    type: "Industrial RO Service",
    price: 5000,
    duration: "5 hours",
    warranty: "1 Year",
    status: "Active",
  },
]

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Services Catalog</h1>
           <p className="text-muted-foreground">Manage service types and pricing details.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

       {/* Services Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {services.map((service) => (
             <div key={service.id} className="bento-card p-5 group hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                      <Wrench className="w-5 h-5" />
                   </div>
                   <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                      {service.status}
                   </Badge>
                </div>
                
                <h3 className="text-lg font-bold mb-1">{service.type}</h3>
                <p className="text-muted-foreground text-sm mb-4">ID: {service.id}</p>
                
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between border-b border-border/50 pb-2">
                       <span className="text-muted-foreground">Base Price</span>
                       <span className="font-semibold">₹{service.price}</span>
                   </div>
                   <div className="flex justify-between border-b border-border/50 pb-2">
                       <span className="text-muted-foreground">Duration</span>
                       <span>{service.duration}</span>
                   </div>
                   <div className="flex justify-between">
                       <span className="text-muted-foreground">Warranty</span>
                       <span>{service.warranty}</span>
                   </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                    <Button variant="outline" className="w-full rounded-xl">Edit</Button>
                </div>
             </div>
         ))}
       </div>
    </div>
  )
}
