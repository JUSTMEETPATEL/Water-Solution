import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { amcCreateSchema } from '@/lib/validations/amc'

// GET /api/amc - List AMC contracts with filters
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

    const [contracts, total] = await Promise.all([
      prisma.aMCContract.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          service: { select: { id: true, serviceType: true } },
        },
        orderBy: { endDate: 'asc' },
      }),
      prisma.aMCContract.count({ where }),
    ])

    return jsonResponse({
      data: contracts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/amc error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/amc - Create new AMC contract
export async function POST(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'FINANCE'])

    const body = await request.json()
    const validation = amcCreateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const contract = await prisma.aMCContract.create({
      data: {
        ...validation.data,
        startDate: new Date(validation.data.startDate),
        endDate: new Date(validation.data.endDate),
        renewalDate: new Date(validation.data.renewalDate),
        status: 'ACTIVE',
      },
      include: {
        customer: { select: { id: true, name: true } },
        service: { select: { id: true, serviceType: true } },
      },
    })

    return jsonResponse(contract, 201)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/amc error:', error)
    return errorResponse('Internal server error', 500)
  }
}
