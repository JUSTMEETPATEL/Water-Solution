import { z } from 'zod'

export const complaintCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  serviceId: z.string().uuid('Invalid service ID'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
})

export const complaintUpdateSchema = z.object({
  description: z.string().min(10).max(1000).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']).optional(),
})

export const complaintAssignSchema = z.object({
  technicianId: z.string().uuid('Invalid technician ID'),
})

export type ComplaintCreateInput = z.infer<typeof complaintCreateSchema>
export type ComplaintUpdateInput = z.infer<typeof complaintUpdateSchema>
export type ComplaintAssignInput = z.infer<typeof complaintAssignSchema>
