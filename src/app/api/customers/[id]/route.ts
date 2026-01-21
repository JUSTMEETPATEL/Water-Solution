import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { customerUpdateSchema } from '@/lib/validations/customer'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/customers/:id - Get single customer with relations
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        services: true,
        amcs: {
          include: { service: true },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        complaints: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!customer) {
      return errorResponse('Customer not found', 404)
    }

    return jsonResponse(customer)
  } catch (error) {
    console.error('GET /api/customers/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/customers/:id - Update customer
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN', 'SUPPORT'])

    const { id } = await params
    const body = await request.json()
    const validation = customerUpdateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: validation.data,
    })

    return jsonResponse(customer)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/customers/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// DELETE /api/customers/:id - Delete customer (ADMIN only)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN'])

    const { id } = await params

    await prisma.customer.delete({
      where: { id },
    })

    return jsonResponse({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/customers/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}
