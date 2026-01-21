"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { AlertCircle, Clock, CheckCircle, Plus } from "lucide-react"

type Complaint = {
  id: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  createdAt: string
  customer: { id: string; name: string; phone: string }
  service: { id: string; serviceType: string }
  technician?: { id: string; name: string }
}

type Service = {
  id: string
  serviceType: string
  customer: { id: string; name: string }
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  async function fetchComplaints() {
    try {
      const res = await fetch('/api/complaints')
      if (res.ok) {
        const data = await res.json()
        setComplaints(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
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
    fetchComplaints()
    fetchServices()
  }, [])

  async function handleCreateComplaint(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormLoading(true)

    const formData = new FormData(e.currentTarget)
    const serviceId = formData.get('serviceId') as string
    const service = services.find(s => s.id === serviceId)

    const data = {
      customerId: service?.customer.id,
      serviceId,
      description: formData.get('description') as string,
    }

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setNewDialogOpen(false)
        fetchComplaints()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create complaint')
      }
    } catch (error) {
      console.error('Failed to create complaint:', error)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleUpdateStatus(id: string, status: 'IN_PROGRESS' | 'RESOLVED') {
    setFormLoading(true)
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        fetchComplaints()
        setDetailsOpen(false)
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const openCount = complaints.filter(c => c.status === 'OPEN').length
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Complaints & Service</h1>
          <p className="text-muted-foreground">Manage customer complaints and service requests.</p>
        </div>
        <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Complaint</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateComplaint} className="space-y-4 pt-4">
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
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the issue in detail..."
                  required
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={formLoading}>
                {formLoading ? 'Creating...' : 'Create Ticket'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="text-2xl font-bold">{loading ? '...' : openCount}</p>
          </div>
        </div>
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">{loading ? '...' : inProgressCount}</p>
          </div>
        </div>
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold">{loading ? '...' : resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 bento-card p-8 text-center text-muted-foreground">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="col-span-2 bento-card p-8 text-center text-muted-foreground">No complaints found</div>
        ) : complaints.map((complaint) => (
          <div key={complaint.id} className="bento-card p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-foreground">{complaint.service.serviceType}</p>
                <p className="text-sm text-muted-foreground">
                  {complaint.customer.name} • ID: {complaint.id.slice(0, 8)}
                </p>
              </div>
              <Badge className={
                complaint.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                complaint.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }>
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{complaint.description}</p>

            <div className="flex items-center justify-between text-sm mb-4">
              <div>
                <span className="text-muted-foreground">Assigned: </span>
                <span className="font-medium">{complaint.technician?.name || 'Unassigned'}</span>
              </div>
              <span className="text-muted-foreground">{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => {
                  setSelectedComplaint(complaint)
                  setDetailsOpen(true)
                }}
              >
                View Details
              </Button>
              {complaint.status === 'OPEN' && (
                <Button 
                  className="flex-1 rounded-xl"
                  onClick={() => handleUpdateStatus(complaint.id, 'IN_PROGRESS')}
                  disabled={formLoading}
                >
                  Start Work
                </Button>
              )}
              {complaint.status === 'IN_PROGRESS' && (
                <Button 
                  className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                  onClick={() => handleUpdateStatus(complaint.id, 'RESOLVED')}
                  disabled={formLoading}
                >
                  Resolve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Ticket ID</p>
                  <p className="font-mono">{selectedComplaint.id.slice(0, 12)}</p>
                </div>
                <Badge className={
                  selectedComplaint.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                  selectedComplaint.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }>
                  {selectedComplaint.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Customer</p>
                <p className="font-bold">{selectedComplaint.customer.name}</p>
                <p className="text-sm">{selectedComplaint.customer.phone}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Service</p>
                <p className="font-medium">{selectedComplaint.service.serviceType}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p>{selectedComplaint.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{selectedComplaint.technician?.name || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedComplaint.status === 'OPEN' && (
                  <Button 
                    className="flex-1 rounded-xl"
                    onClick={() => handleUpdateStatus(selectedComplaint.id, 'IN_PROGRESS')}
                    disabled={formLoading}
                  >
                    Start Work
                  </Button>
                )}
                {selectedComplaint.status === 'IN_PROGRESS' && (
                  <Button 
                    className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(selectedComplaint.id, 'RESOLVED')}
                    disabled={formLoading}
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
