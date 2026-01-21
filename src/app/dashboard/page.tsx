"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowUpRight, TrendingUp, Users, DollarSign, Wallet, AlertCircle, Download } from "lucide-react"

type DashboardStats = {
  customers: { total: number }
  amc: { active: number; expiringSoon: number; expired: number }
  complaints: { open: number; inProgress: number }
  payments: { monthlyRevenue: number; pendingAmount: number; pendingCount: number }
  recent: {
    complaints: Array<{ id: string; description: string; status: string; customer: { name: string }; service: { serviceType: string } }>
    payments: Array<{ id: string; amount: number; status: string; customer: { name: string }; createdAt: string }>
  }
}

const chartData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 34000 },
  { month: "Mar", revenue: 49000, expenses: 31000 },
  { month: "Apr", revenue: 62000, expenses: 40000 },
  { month: "May", revenue: 58000, expenses: 38000 },
  { month: "Jun", revenue: 71000, expenses: 49000 },
  { month: "Jul", revenue: 75000, expenses: 51000 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Customers",
      value: loading ? "..." : stats?.customers.total.toLocaleString() || "0",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/dashboard/customers",
    },
    {
      title: "Active AMCs",
      value: loading ? "..." : stats?.amc.active.toLocaleString() || "0",
      change: `${stats?.amc.expiringSoon || 0} expiring`,
      trend: "up",
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/dashboard/amc",
    },
    {
      title: "Pending Payments",
      value: loading ? "..." : `₹${(stats?.payments.pendingAmount || 0).toLocaleString()}`,
      change: `${stats?.payments.pendingCount || 0} invoices`,
      trend: "down",
      icon: Wallet,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      href: "/dashboard/payments",
    },
    {
      title: "Open Complaints",
      value: loading ? "..." : (stats?.complaints.open || 0).toString(),
      change: `${stats?.complaints.inProgress || 0} in progress`,
      trend: "down",
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      href: "/dashboard/complaints",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => {
                // Generate a simple CSV report
                if (!stats) return
                const csvContent = [
                  'Dashboard Report',
                  `Generated: ${new Date().toLocaleString()}`,
                  '',
                  'Metric,Value',
                  `Total Customers,${stats.customers.total}`,
                  `Active AMCs,${stats.amc.active}`,
                  `Expiring Soon,${stats.amc.expiringSoon}`,
                  `Pending Payments,₹${stats.payments.pendingAmount}`,
                  `Open Complaints,${stats.complaints.open}`,
                ].join('\n')
                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`
                a.click()
                window.URL.revokeObjectURL(url)
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button 
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
              onClick={() => router.push('/dashboard/payments')}
            >
                + New Transaction
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={stat.title}
            className="bento-card p-5 flex flex-col justify-between hover:scale-[1.02] cursor-pointer transition-transform"
            onClick={() => router.push(stat.href)}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}
              >
                <stat.icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <Badge
                variant="secondary"
                className={`rounded-full px-2 py-0.5 font-semibold text-xs flex items-center gap-1 ${
                  stat.trend === "up" ? "text-green-600 bg-green-100" : "text-orange-600 bg-orange-100"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <ArrowUpRight className="w-3 h-3 rotate-180" />
                )}
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Spans 2 cols */}
        <div className="lg:col-span-2 bento-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Revenue Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Monthly revenue vs expenses
              </p>
            </div>
            <select className="text-sm border-none bg-secondary/50 rounded-lg px-3 py-1 font-medium focus:ring-0 cursor-pointer outline-none">
                <option>Last 6 Months</option>
                <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    dy={10}
                />
                <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--chart-2)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bento-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary hover:text-primary" onClick={() => router.push('/dashboard/payments')}>View All</Button>
            </div>
            
            <div className="space-y-6 flex-1 overflow-auto">
                {loading ? (
                  <div className="text-center text-muted-foreground py-4">Loading...</div>
                ) : stats?.recent.payments.slice(0, 5).map((payment, i) => (
                    <div key={payment.id} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            <DollarSign className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">
                                {payment.status === 'PAID' ? "Payment Received" : "Payment Pending"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                from {payment.customer?.name}
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-medium">
                                {payment.status === 'PAID' ? '+' : ''}₹{payment.amount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4 rounded-xl border-dashed border-2 hover:bg-secondary/50 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
              onClick={() => router.push('/dashboard/payments')}
            >
                View Timeline
            </Button>
        </div>
      </div>
    </div>
  )
}
