import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { amcUpdateSchema } from '@/lib/validations/amc'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/amc/:id
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const contract = await prisma.aMCContract.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!contract) {
      return errorResponse('AMC Contract not found', 404)
    }

    return jsonResponse(contract)
  } catch (error) {
    console.error('GET /api/amc/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/amc/:id
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN', 'FINANCE'])

    const { id } = await params
    const body = await request.json()
    const validation = amcUpdateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    const updateData: Record<string, unknown> = { ...validation.data }
    if (validation.data.endDate) updateData.endDate = new Date(validation.data.endDate)
    if (validation.data.renewalDate) updateData.renewalDate = new Date(validation.data.renewalDate)

    const contract = await prisma.aMCContract.update({
      where: { id },
      data: updateData,
    })

    return jsonResponse(contract)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/amc/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// DELETE /api/amc/:id
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN'])

    const { id } = await params

    await prisma.aMCContract.delete({ where: { id } })

    return jsonResponse({ success: true })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('DELETE /api/amc/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}
