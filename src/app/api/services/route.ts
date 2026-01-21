import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { serviceCreateSchema } from '@/lib/validations/service'

// GET /api/services - List all services
export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    const where = customerId ? { customerId } : {}

    const services = await prisma.service.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        _count: { select: { amcContracts: true, complaints: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return jsonResponse({ data: services })
  } catch (error) {
    console.error('GET /api/services error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/services - Create new service
export async function POST(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'SUPPORT'])

    const body = await request.json()
    const validation = serviceCreateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const service = await prisma.service.create({
      data: {
        ...validation.data,
        installationDate: new Date(validation.data.installationDate),
      },
      include: { customer: { select: { id: true, name: true } } },
    })

    return jsonResponse(service, 201)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/services error:', error)
    return errorResponse('Internal server error', 500)
  }
}
