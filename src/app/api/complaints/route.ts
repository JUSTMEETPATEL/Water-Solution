import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession, hasRole } from '@/lib/auth-guard'
import { complaintCreateSchema } from '@/lib/validations/complaint'

// GET /api/complaints - List complaints with filters
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

    // Technicians can only see their assigned complaints
    if (session.user.role === 'TECHNICIAN') {
      where.technicianId = session.user.id
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          service: { select: { id: true, serviceType: true } },
          technician: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.complaint.count({ where }),
    ])

    return jsonResponse({
      data: complaints,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/complaints error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/complaints - Create new complaint
export async function POST(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'SUPPORT'])

    const body = await request.json()
    const validation = complaintCreateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const complaint = await prisma.complaint.create({
      data: {
        ...validation.data,
        status: 'OPEN',
      },
      include: {
        customer: { select: { id: true, name: true } },
        service: { select: { id: true, serviceType: true } },
      },
    })

    // Create notification for the customer
    await prisma.notification.create({
      data: {
        customerId: validation.data.customerId,
        type: 'COMPLAINT_UPDATE',
        message: `Your complaint has been registered. Ticket ID: ${complaint.id.slice(0, 8)}`,
      },
    })

    return jsonResponse(complaint, 201)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/complaints error:', error)
    return errorResponse('Internal server error', 500)
  }
}
