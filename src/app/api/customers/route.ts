import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { customerCreateSchema } from '@/lib/validations/customer'

// GET /api/customers - List all customers (paginated)
export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { services: true, amcs: true, complaints: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ])

    return jsonResponse({
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/customers error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/customers - Create new customer
export async function POST(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'SUPPORT'])

    const body = await request.json()
    const validation = customerCreateSchema.safeParse(body)

    if (!validation.success) {
      const message = validation.error.issues?.[0]?.message || 'Validation failed'
      return errorResponse(message, 400)
    }

    const customer = await prisma.customer.create({
      data: validation.data,
    })

    return jsonResponse(customer, 201)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/customers error:', error)
    return errorResponse('Internal server error', 500)
  }
}
