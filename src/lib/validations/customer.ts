import { z } from 'zod'

export const customerCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email').optional().nullable(),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
})

export const customerUpdateSchema = customerCreateSchema.partial()

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>
