import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-guard'

// GET /api/dashboard/stats - Get dashboard overview statistics
export async function GET(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'FINANCE', 'SUPPORT'])

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const [
      totalCustomers,
      activeAMCs,
      expiringAMCs,
      expiredAMCs,
      openComplaints,
      inProgressComplaints,
      monthlyRevenue,
      pendingPayments,
      recentComplaints,
      recentPayments,
    ] = await Promise.all([
      // Total customers
      prisma.customer.count(),
      
      // Active AMCs
      prisma.aMCContract.count({ where: { status: 'ACTIVE' } }),
      
      // Expiring soon (within 30 days)
      prisma.aMCContract.count({
        where: {
          status: 'ACTIVE',
          endDate: { lte: thirtyDaysFromNow, gt: now },
        },
      }),
      
      // Expired AMCs
      prisma.aMCContract.count({ where: { status: 'EXPIRED' } }),
      
      // Open complaints
      prisma.complaint.count({ where: { status: 'OPEN' } }),
      
      // In progress complaints
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          status: 'PAID',
          paymentDate: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      
      // Pending payments
      prisma.payment.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true,
      }),
      
      // Recent complaints
      prisma.complaint.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true } },
          service: { select: { serviceType: true } },
        },
      }),
      
      // Recent payments
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true } },
        },
      }),
    ])

    return jsonResponse({
      customers: {
        total: totalCustomers,
      },
      amc: {
        active: activeAMCs,
        expiringSoon: expiringAMCs,
        expired: expiredAMCs,
      },
      complaints: {
        open: openComplaints,
        inProgress: inProgressComplaints,
      },
      payments: {
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        pendingAmount: pendingPayments._sum.amount || 0,
        pendingCount: pendingPayments._count || 0,
      },
      recent: {
        complaints: recentComplaints,
        payments: recentPayments,
      },
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('GET /api/dashboard/stats error:', error)
    return errorResponse('Internal server error', 500)
  }
}
