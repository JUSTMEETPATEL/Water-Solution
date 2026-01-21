import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-guard'

// POST /api/amc/[id]/renew - Renew an AMC contract
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(request, ['ADMIN', 'FINANCE'])

    const { id } = await params
    const body = await request.json()
    const months = body.months || 12

    // Find existing contract
    const contract = await prisma.aMCContract.findUnique({
      where: { id },
    })

    if (!contract) {
      return errorResponse('Contract not found', 404)
    }

    // Calculate new dates
    const currentEndDate = new Date(contract.endDate)
    const newEndDate = new Date(currentEndDate)
    newEndDate.setMonth(newEndDate.getMonth() + months)

    const newRenewalDate = new Date(newEndDate)
    newRenewalDate.setDate(newRenewalDate.getDate() - 30) // 30 days before end

    // Update the contract
    const updatedContract = await prisma.aMCContract.update({
      where: { id },
      data: {
        endDate: newEndDate,
        renewalDate: newRenewalDate,
        status: 'ACTIVE',
      },
      include: {
        customer: { select: { id: true, name: true } },
        service: { select: { id: true, serviceType: true } },
      },
    })

    return jsonResponse({
      message: 'Contract renewed successfully',
      contract: updatedContract,
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('POST /api/amc/[id]/renew error:', error)
    return errorResponse('Internal server error', 500)
  }
}
