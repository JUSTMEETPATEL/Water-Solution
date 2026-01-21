import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'
import { complaintUpdateSchema } from '@/lib/validations/complaint'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/complaints/:id
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        technician: { select: { id: true, name: true, email: true } },
      },
    })

    if (!complaint) {
      return errorResponse('Complaint not found', 404)
    }

    // Technicians can only view their assigned complaints
    if (session.user.role === 'TECHNICIAN' && complaint.technicianId !== session.user.id) {
      return errorResponse('Forbidden', 403)
    }

    return jsonResponse(complaint)
  } catch (error) {
    console.error('GET /api/complaints/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/complaints/:id - Update complaint
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    const body = await request.json()
    const validation = complaintUpdateSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    // Technicians can only update status of their assigned complaints
    if (session.user.role === 'TECHNICIAN') {
      const existing = await prisma.complaint.findUnique({ where: { id } })
      if (existing?.technicianId !== session.user.id) {
        return errorResponse('Forbidden', 403)
      }
      // Technicians can only update status
      if (validation.data.description) {
        return errorResponse('Technicians can only update status', 403)
      }
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: validation.data,
      include: {
        customer: { select: { id: true, name: true } },
      },
    })

    // Send notification on status change
    if (validation.data.status) {
      await prisma.notification.create({
        data: {
          customerId: complaint.customerId,
          type: 'COMPLAINT_UPDATE',
          message: `Your complaint status updated to: ${validation.data.status}`,
        },
      })
    }

    return jsonResponse(complaint)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('PUT /api/complaints/:id error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PATCH /api/complaints/:id - Update complaint (alias for PUT)
export { PUT as PATCH }
