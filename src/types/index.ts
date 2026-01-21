// Re-export Prisma types for convenience
export type {
  Role,
  AMCStatus,
  PaymentStatus,
  ComplaintStatus,
  NotificationType,
  FinanceType,
  Customer,
  Service,
  AMCContract,
  Payment,
  Complaint,
  Notification,
  FinanceLog,
} from '@prisma/client'

// Dashboard stat types
export interface DashboardStat {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon?: string
}

// Table pagination
export interface PaginationParams {
  page: number
  limit: number
  search?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form state
export interface FormState {
  success: boolean
  error?: string
  message?: string
}

// Navigation item
export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: number
  disabled?: boolean
}
