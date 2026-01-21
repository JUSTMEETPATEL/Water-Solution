import { z } from 'zod'

export const paymentCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  amcId: z.string().uuid('Invalid AMC ID').optional().nullable(),
  amount: z.number().positive('Amount must be positive'),
  paymentMode: z.enum(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CHEQUE']),
  paymentDate: z.string().datetime().or(z.date()).optional(),
})

export const paymentUpdateSchema = z.object({
  status: z.enum(['PAID', 'PENDING', 'FAILED']),
  paymentDate: z.string().datetime().or(z.date()).optional(),
})

export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>
