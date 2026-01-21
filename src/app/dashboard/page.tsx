"use client"

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
import { ArrowUpRight, TrendingUp, Users, DollarSign, Wallet, AlertCircle } from "lucide-react"

const chartData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 34000 },
  { month: "Mar", revenue: 49000, expenses: 31000 },
  { month: "Apr", revenue: 62000, expenses: 40000 },
  { month: "May", revenue: 58000, expenses: 38000 },
  { month: "Jun", revenue: 71000, expenses: 49000 },
  { month: "Jul", revenue: 75000, expenses: 51000 },
]

const stats = [
  {
    title: "Total Revenue",
    value: "₹8,42,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Active Customers",
    value: "1,284",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Pending Payments",
    value: "₹45,200",
    change: "-2.4%",
    trend: "down",
    icon: Wallet,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Open Complaints",
    value: "12",
    change: "-4",
    trend: "down",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
]

export default function DashboardPage() {
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
            <Button variant="outline" className="rounded-full">Download Report</Button>
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                + New Transaction
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.title}
            className="bento-card p-5 flex flex-col justify-between hover:scale-[1.02] cursor-pointer"
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
                  stat.trend === "up" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
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

        {/* Recent Activity / Action - Spans 1 col */}
        <div className="bento-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-primary hover:text-primary">View All</Button>
            </div>
            
            <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {i % 2 === 0 ? <DollarSign className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">
                                {i % 2 === 0 ? "Payment Received" : "New Complaint"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {i % 2 === 0 ? "from Rahul Sharma" : "Microtek RO servicing"}
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-medium">
                                {i % 2 === 0 ? "+₹4,500" : "Pending"}
                            </p>
                            <p className="text-xs text-muted-foreground">2m ago</p>
                        </div>
                    </div>
                ))}
            </div>

            <Button variant="outline" className="w-full mt-auto rounded-xl border-dashed border-2 hover:bg-secondary/50 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all">
                View Timeline
            </Button>
        </div>
      </div>
    </div>
  )
}
