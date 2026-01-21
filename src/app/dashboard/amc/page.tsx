"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { FileText, Plus, Calendar, RefreshCw } from "lucide-react"

type AMCContract = {
  id: string
  startDate: string
  endDate: string
  renewalDate: string
  amount: number
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING_PAYMENT'
  customer: { id: string; name: string; phone: string }
  service: { id: string; serviceType: string }
}

type Service = {
  id: string
  serviceType: string
  customer: { id: string; name: string }
}

export default function AMCPage() {
  const [contracts, setContracts] = useState<AMCContract[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<AMCContract | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  async function fetchContracts() {
    try {
      const res = await fetch('/api/amc')
      if (res.ok) {
        const data = await res.json()
        setContracts(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchServices() {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    }
  }

  useEffect(() => {
    fetchContracts()
    fetchServices()
  }, [])

  async function handleCreateContract(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormLoading(true)

    const formData = new FormData(e.currentTarget)
    const serviceId = formData.get('serviceId') as string
    const service = services.find(s => s.id === serviceId)

    const data = {
      customerId: service?.customer.id,
      serviceId,
      startDate: new Date(formData.get('startDate') as string).toISOString(),
      endDate: new Date(formData.get('endDate') as string).toISOString(),
      amount: parseFloat(formData.get('amount') as string),
    }

    try {
      const res = await fetch('/api/amc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setNewDialogOpen(false)
        fetchContracts()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create contract')
      }
    } catch (error) {
      console.error('Failed to create contract:', error)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleRenew() {
    if (!selectedContract) return
    setFormLoading(true)

    try {
      const res = await fetch(`/api/amc/${selectedContract.id}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ months: 12 }),
      })

      if (res.ok) {
        setRenewDialogOpen(false)
        fetchContracts()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to renew contract')
      }
    } catch (error) {
      console.error('Failed to renew contract:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const getProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime()
    const endDate = new Date(end).getTime()
    const now = Date.now()
    const total = endDate - startDate
    const elapsed = now - startDate
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  const activeCount = contracts.filter(c => c.status === 'ACTIVE').length
  const expiredCount = contracts.filter(c => c.status === 'EXPIRED').length
  const expiringSoonCount = contracts.filter(c => {
    const end = new Date(c.endDate)
    const now = new Date()
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    return c.status === 'ACTIVE' && end.getTime() - now.getTime() < thirtyDays
  }).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">AMC Contracts</h1>
          <p className="text-muted-foreground">Manage annual maintenance contracts and renewals.</p>
        </div>
        <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> New Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New AMC Contract</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateContract} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="serviceId">Service *</Label>
                <Select name="serviceId" required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.customer.name} - {service.serviceType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input id="startDate" name="startDate" type="date" required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input id="endDate" name="endDate" type="date" required className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input id="amount" name="amount" type="number" placeholder="4500" required className="rounded-xl" />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={formLoading}>
                {formLoading ? 'Creating...' : 'Create Contract'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Contracts</p>
            <p className="text-2xl font-bold">{loading ? '...' : activeCount}</p>
          </div>
        </div>
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
            <p className="text-2xl font-bold">{loading ? '...' : expiringSoonCount}</p>
          </div>
        </div>
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expired</p>
            <p className="text-2xl font-bold">{loading ? '...' : expiredCount}</p>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 bento-card p-8 text-center text-muted-foreground">Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="col-span-2 bento-card p-8 text-center text-muted-foreground">No contracts found</div>
        ) : contracts.map((contract) => (
          <div key={contract.id} className="bento-card p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-foreground">{contract.customer.name}</p>
                <p className="text-sm text-muted-foreground">{contract.service.serviceType}</p>
              </div>
              <Badge className={
                contract.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                contract.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                'bg-orange-100 text-orange-700'
              }>
                {contract.status}
              </Badge>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Contract Progress</span>
                <span>{Math.round(getProgress(contract.startDate, contract.endDate))}%</span>
              </div>
              <Progress value={getProgress(contract.startDate, contract.endDate)} className="h-2" />
            </div>

            <div className="flex justify-between text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Start</p>
                <p className="font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium text-primary">₹{contract.amount.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground">End</p>
                <p className="font-medium">{new Date(contract.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => {
                  setSelectedContract(contract)
                  setDetailsDialogOpen(true)
                }}
              >
                Details
              </Button>
              <Button 
                className="flex-1 rounded-xl"
                onClick={() => {
                  setSelectedContract(contract)
                  setRenewDialogOpen(true)
                }}
              >
                Renew
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-bold text-lg">{selectedContract.customer.name}</p>
                <p className="text-sm">{selectedContract.customer.phone}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-bold">{selectedContract.service.serviceType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/30 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(selectedContract.startDate).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-medium">{new Date(selectedContract.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary">₹{selectedContract.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Contract Amount</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl text-center">
                  <Badge className={
                    selectedContract.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    selectedContract.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }>
                    {selectedContract.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-xl" onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Renew Contract</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-secondary/50 rounded-xl text-center">
                <p className="text-sm text-muted-foreground">Renewing contract for</p>
                <p className="font-bold text-lg">{selectedContract.customer.name}</p>
                <p className="text-sm">{selectedContract.service.serviceType}</p>
              </div>

              <div className="p-4 bg-primary/10 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">New End Date</p>
                <p className="text-xl font-bold text-primary">
                  {new Date(new Date(selectedContract.endDate).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">(+12 months)</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setRenewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 rounded-xl" onClick={handleRenew} disabled={formLoading}>
                  {formLoading ? 'Renewing...' : 'Confirm Renewal'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
