import { z } from 'zod'

export const serviceCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  serviceType: z.string().min(2, 'Service type required').max(100),
  installationDate: z.string().datetime().or(z.date()),
})

export const serviceUpdateSchema = z.object({
  serviceType: z.string().min(2).max(100).optional(),
  installationDate: z.string().datetime().or(z.date()).optional(),
})

export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>
