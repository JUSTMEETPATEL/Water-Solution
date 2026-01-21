"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Wrench, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Service = {
  id: string
  serviceType: string
  installationDate: string
  createdAt: string
  customer: { id: string; name: string; phone?: string }
  _count?: { amcContracts: number; complaints: number }
}

type Customer = {
  id: string
  name: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  async function fetchServices() {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch('/api/customers')
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  useEffect(() => {
    fetchServices()
    fetchCustomers()
  }, [])

  async function handleAddService(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      customerId: formData.get('customerId') as string,
      serviceType: formData.get('serviceType') as string,
      installationDate: new Date(formData.get('installationDate') as string).toISOString(),
    }

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setDialogOpen(false)
        fetchServices()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to add service')
      }
    } catch (error) {
      console.error('Failed to add service:', error)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Services</h1>
          <p className="text-muted-foreground">Manage customer service installations.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer *</Label>
                <Select name="customerId" required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Input
                  id="serviceType"
                  name="serviceType"
                  placeholder="e.g. RO Water Purifier - Aquaguard"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="installationDate">Installation Date *</Label>
                <Input
                  id="installationDate"
                  name="installationDate"
                  type="date"
                  required
                  className="rounded-xl"
                />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={formLoading}>
                {formLoading ? 'Adding...' : 'Add Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 bento-card p-8 text-center text-muted-foreground">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-3 bento-card p-8 text-center text-muted-foreground">
            No services found. Add your first service!
          </div>
        ) : services.map((service) => (
          <div key={service.id} className="bento-card p-5 group hover:border-primary/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                <Wrench className="w-5 h-5" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                Active
              </Badge>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{service.serviceType}</h3>
            <p className="text-muted-foreground text-sm mb-4">Customer: {service.customer?.name}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Service ID</span>
                <span className="font-mono text-xs">{service.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Installation Date</span>
                <span>{new Date(service.installationDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
              <Button 
                variant="outline" 
                className="w-full rounded-xl"
                onClick={() => {
                  setSelectedService(service)
                  setDetailsOpen(true)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Service Details</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">{selectedService.serviceType}</h3>
                  <p className="text-sm text-muted-foreground">ID: {selectedService.id.slice(0, 8)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedService.customer?.name}</p>
                  {selectedService.customer?.phone && (
                    <p className="text-sm text-muted-foreground">{selectedService.customer.phone}</p>
                  )}
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground">Installation Date</p>
                  <p className="font-medium">{new Date(selectedService.installationDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedService._count && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/30 rounded-xl text-center">
                    <p className="text-2xl font-bold text-primary">{selectedService._count.amcContracts}</p>
                    <p className="text-xs text-muted-foreground">AMC Contracts</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl text-center">
                    <p className="text-2xl font-bold text-orange-600">{selectedService._count.complaints}</p>
                    <p className="text-xs text-muted-foreground">Complaints</p>
                  </div>
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full rounded-xl" 
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
