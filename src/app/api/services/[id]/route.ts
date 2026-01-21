import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { serviceUpdateSchema } from '@/lib/validations/service'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/services/:id
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        customer: true,
        amcContracts: { orderBy: { createdAt: 'desc' } },
        complaints: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    })

    if (!service) {
      return errorResponse('Service not found', 404)
    }

    return jsonResponse(service)
  } catch (error) {
    console.error('GET /api/services/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/services/:id
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN', 'SUPPORT'])

    const { id } = await params
    const body = await request.json()
    const validation = serviceUpdateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const updateData: Record<string, unknown> = { ...validation.data }
    if (validation.data.installationDate) {
      updateData.installationDate = new Date(validation.data.installationDate)
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    })

    return jsonResponse(service)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/services/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// DELETE /api/services/:id
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN'])

    const { id } = await params

    await prisma.service.delete({ where: { id } })

    return jsonResponse({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/services/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}
