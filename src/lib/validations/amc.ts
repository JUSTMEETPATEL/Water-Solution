import { z } from 'zod'

export const amcCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  serviceId: z.string().uuid('Invalid service ID'),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  renewalDate: z.string().datetime().or(z.date()),
  amount: z.number().positive('Amount must be positive'),
})

export const amcUpdateSchema = z.object({
  endDate: z.string().datetime().or(z.date()).optional(),
  renewalDate: z.string().datetime().or(z.date()).optional(),
  amount: z.number().positive().optional(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'PENDING_PAYMENT']).optional(),
})

export type AMCCreateInput = z.infer<typeof amcCreateSchema>
export type AMCUpdateInput = z.infer<typeof amcUpdateSchema>
