"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Bell, Search, Settings, X, Plus, Users, FileText, Wrench, AlertCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type SearchResult = {
  type: 'customer' | 'amc' | 'payment' | 'complaint' | 'service'
  id: string
  title: string
  subtitle: string
}

type Notification = {
  id: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
  customer?: { name: string }
}

export function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  // Fetch notifications on mount
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications?limit=10')
        if (res.ok) {
          const data = await res.json()
          // API returns { data: [...] }
          const notificationList = Array.isArray(data) ? data : (data.data || [])
          setNotifications(notificationList)
          setUnreadCount(notificationList.filter((n: Notification) => !n.isRead).length)
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }
    fetchNotifications()
  }, [])

  // Search functionality
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true)
        try {
          // Search across multiple endpoints
          const [customersRes, amcRes, complaintsRes] = await Promise.all([
            fetch(`/api/customers?search=${encodeURIComponent(searchQuery)}`),
            fetch(`/api/amc?search=${encodeURIComponent(searchQuery)}`),
            fetch(`/api/complaints?search=${encodeURIComponent(searchQuery)}`),
          ])

          const results: SearchResult[] = []

          if (customersRes.ok) {
            const { data } = await customersRes.json()
            data?.slice(0, 3).forEach((c: { id: string; name: string; email: string }) => {
              results.push({
                type: 'customer',
                id: c.id,
                title: c.name,
                subtitle: c.email || 'Customer',
              })
            })
          }

          if (amcRes.ok) {
            const { data } = await amcRes.json()
            data?.slice(0, 3).forEach((a: { id: string; customer?: { name: string }; service?: { serviceType: string } }) => {
              results.push({
                type: 'amc',
                id: a.id,
                title: a.customer?.name || 'AMC Contract',
                subtitle: a.service?.serviceType || 'Contract',
              })
            })
          }

          if (complaintsRes.ok) {
            const { data } = await complaintsRes.json()
            data?.slice(0, 3).forEach((c: { id: string; description: string; customer?: { name: string } }) => {
              results.push({
                type: 'complaint',
                id: c.id,
                title: c.description?.slice(0, 50) || 'Complaint',
                subtitle: c.customer?.name || 'Complaint',
              })
            })
          }

          setSearchResults(results)
          setShowResults(true)
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchResultClick = (result: SearchResult) => {
    setShowResults(false)
    setSearchQuery("")
    switch (result.type) {
      case 'customer':
        router.push(`/dashboard/customers`)
        break
      case 'amc':
        router.push(`/dashboard/amc`)
        break
      case 'complaint':
        router.push(`/dashboard/complaints`)
        break
      default:
        break
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)
    if (unreadIds.length === 0) return
    
    try {
      await fetch('/api/notifications', { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadIds })
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'customer': return <Users className="h-4 w-4" />
      case 'amc': return <FileText className="h-4 w-4" />
      case 'complaint': return <AlertCircle className="h-4 w-4" />
      case 'service': return <Wrench className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <header className="sticky top-0 z-40 w-full mb-6">
      <div className="flex h-16 items-center justify-between glass-card rounded-2xl px-6 py-3 my-4 mx-0 shadow-sm">
        
        {/* Search */}
        <div ref={searchRef} className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search customers, invoices..." 
            className="pl-9 h-10 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearchQuery("")
                setShowResults(false)
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-lg overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-center text-muted-foreground text-sm">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="max-h-80 overflow-auto">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-1 rounded">
                        {result.type}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-secondary text-muted-foreground hover:text-foreground relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-semibold">Notifications</h4>
                {unreadCount > 0 && (
                  <button 
                    className="text-xs text-primary hover:underline"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b last:border-0 hover:bg-secondary/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <p className="text-sm font-medium capitalize">{notification.type.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatTime(notification.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-10 w-10 hover:bg-secondary text-muted-foreground hover:text-foreground"
            onClick={() => router.push('/dashboard/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <div className="h-4 w-[1px] bg-border mx-1" />

          {/* New Entry Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full rounded-2xl border-primary/20 text-primary hover:bg-primary/5 font-semibold text-xs h-9">
                <Plus className="h-4 w-4 mr-1" />
                New Entry
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/customers')}>
                <Users className="h-4 w-4 mr-2" />
                Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/amc')}>
                <FileText className="h-4 w-4 mr-2" />
                AMC Contract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/payments')}>
                <DollarSign className="h-4 w-4 mr-2" />
                Payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/complaints')}>
                <AlertCircle className="h-4 w-4 mr-2" />
                Complaint
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/services')}>
                <Wrench className="h-4 w-4 mr-2" />
                Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
