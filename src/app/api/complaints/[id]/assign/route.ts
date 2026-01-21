import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-guard'
import { complaintAssignSchema } from '@/lib/validations/complaint'

type RouteParams = { params: Promise<{ id: string }> }

// POST /api/complaints/:id/assign - Assign technician to complaint
export async function POST(request: Request, { params }: RouteParams) {
  try {
    await requireRole(request, ['ADMIN', 'SUPPORT'])

    const { id } = await params
    const body = await request.json()
    const validation = complaintAssignSchema.safeParse(body)

    if (!validation.success) {
      return errorResponse(validation.error.issues?.[0]?.message || "Validation failed", 400)
    }

    // Verify technician exists and has TECHNICIAN role
    const technician = await prisma.user.findUnique({
      where: { id: validation.data.technicianId },
    })

    if (!technician || technician.role !== 'TECHNICIAN') {
      return errorResponse('Invalid technician', 400)
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        technicianId: validation.data.technicianId,
        status: 'IN_PROGRESS',
      },
      include: {
        customer: { select: { id: true, name: true } },
        technician: { select: { id: true, name: true } },
      },
    })

    // Notify customer
    await prisma.notification.create({
      data: {
        customerId: complaint.customerId,
        type: 'COMPLAINT_UPDATE',
        message: `Technician ${technician.name} has been assigned to your complaint.`,
      },
    })

    return jsonResponse(complaint)
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/complaints/:id/assign error:', error)
    return errorResponse('Internal server error', 500)
  }
}
