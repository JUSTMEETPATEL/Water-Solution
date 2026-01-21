"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { DollarSign, TrendingUp, Clock, XCircle, Filter, Download, Plus } from "lucide-react"

type Payment = {
  id: string
  amount: number
  status: 'PAID' | 'PENDING' | 'FAILED'
  paymentMode: string
  paymentDate: string | null
  createdAt: string
  customer: { id: string; name: string; phone: string }
  amc?: { id: string; status: string }
}

type Customer = {
  id: string
  name: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<{ totalRevenue: number; pendingAmount: number; failedAmount: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  async function fetchPayments() {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/payments/stats')
      ])
      
      if (paymentsRes.ok) {
        const data = await paymentsRes.json()
        setPayments(data.data || [])
      }
      
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
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
    fetchPayments()
    fetchCustomers()
  }, [])

  async function handleRecordPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      customerId: formData.get('customerId') as string,
      amount: parseFloat(formData.get('amount') as string),
      paymentMode: formData.get('paymentMode') as string,
      status: formData.get('status') as string,
      paymentDate: formData.get('status') === 'PAID' ? new Date().toISOString() : null,
    }

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setDialogOpen(false)
        fetchPayments()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to record payment')
      }
    } catch (error) {
      console.error('Failed to record payment:', error)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleMarkAsPaid(paymentId: string) {
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID', paymentDate: new Date().toISOString() }),
      })

      if (res.ok) {
        fetchPayments()
        setDetailsOpen(false)
      }
    } catch (error) {
      console.error('Failed to update payment:', error)
    }
  }

  function handleExport() {
    const csv = [
      ['Transaction ID', 'Customer', 'Amount', 'Status', 'Method', 'Date'],
      ...payments.map(p => [
        p.id,
        p.customer.name,
        p.amount.toString(),
        p.status,
        p.paymentMode,
        p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredPayments = statusFilter === 'all' 
    ? payments 
    : payments.filter(p => p.status === statusFilter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track transactions and financial records.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRecordPayment} className="space-y-4 pt-4">
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
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input id="amount" name="amount" type="number" placeholder="2500" required className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMode">Payment Method *</Label>
                  <Select name="paymentMode" required>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="CHEQUE">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select name="status" required>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={formLoading}>
                {formLoading ? 'Recording...' : 'Record Payment'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Collected</p>
            <p className="text-2xl font-bold">₹{loading ? '...' : (stats?.totalRevenue || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">₹{loading ? '...' : (stats?.pendingAmount || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bento-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold">₹{loading ? '...' : (stats?.failedAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bento-card overflow-hidden">
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-semibold">Recent Transactions</h3>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] rounded-full h-9">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/30">
                <th className="text-left p-4 font-semibold text-muted-foreground">Transaction ID</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Method</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">Amount</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">Loading payments...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">No payments found</td>
                </tr>
              ) : filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <p className="font-mono text-xs">{payment.id.slice(0, 8).toUpperCase()}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{payment.customer.name}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 hidden md:table-cell text-muted-foreground">{payment.paymentMode}</td>
                  <td className="p-4">
                    <Badge className={
                      payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      payment.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-semibold">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full"
                      onClick={() => {
                        setSelectedPayment(payment)
                        setDetailsOpen(true)
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-secondary/50 rounded-xl text-center">
                <p className="text-3xl font-bold text-primary">₹{selectedPayment.amount.toLocaleString()}</p>
                <Badge className={
                  selectedPayment.status === 'PAID' ? 'bg-green-100 text-green-700 mt-2' :
                  selectedPayment.status === 'PENDING' ? 'bg-orange-100 text-orange-700 mt-2' :
                  'bg-red-100 text-red-700 mt-2'
                }>
                  {selectedPayment.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedPayment.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{selectedPayment.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleDateString() : 'Not paid yet'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{selectedPayment.id.slice(0, 12)}</span>
                </div>
              </div>

              {selectedPayment.status === 'PENDING' && (
                <Button 
                  className="w-full rounded-xl" 
                  onClick={() => handleMarkAsPaid(selectedPayment.id)}
                >
                  Mark as Paid
                </Button>
              )}
              
              <Button variant="outline" className="w-full rounded-xl" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
