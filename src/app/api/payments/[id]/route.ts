import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { paymentUpdateSchema } from '@/lib/validations/payment'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/payments/:id
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        customer: true,
        amc: { include: { service: true } },
        financeLog: true,
      },
    })

    if (!payment) {
      return errorResponse('Payment not found', 404)
    }

    return jsonResponse(payment)
  } catch (error) {
    console.error('GET /api/payments/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/payments/:id - Update payment status
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN', 'FINANCE'])

    const { id } = await params
    const body = await request.json()
    const validation = paymentUpdateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const updateData: Record<string, unknown> = { ...validation.data }
    if (validation.data.paymentDate) {
      updateData.paymentDate = new Date(validation.data.paymentDate)
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
    })

    return jsonResponse(payment)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/payments/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}
