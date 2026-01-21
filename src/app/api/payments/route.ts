import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { paymentCreateSchema } from '@/lib/validations/payment'

// GET /api/payments - List payments with filters
export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (customerId) where.customerId = customerId

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          amc: { select: { id: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ])

    return jsonResponse({
      data: payments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/payments error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/payments - Record new payment
export async function POST(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'FINANCE'])

    const body = await request.json()
    const validation = paymentCreateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const payment = await prisma.payment.create({
      data: {
        ...validation.data,
        paymentDate: validation.data.paymentDate 
          ? new Date(validation.data.paymentDate) 
          : new Date(),
        status: 'PAID',
      },
      include: {
        customer: { select: { id: true, name: true } },
      },
    })

    // Create finance log entry
    await prisma.financeLog.create({
      data: {
        type: 'INCOME',
        paymentId: payment.id,
        amount: payment.amount,
      },
    })

    return jsonResponse(payment, 201)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/payments error:', error)
    return errorResponse('Internal server error', 500)
  }
}
