import { prisma } from '@/lib/prisma'
import { requireRole, jsonResponse, errorResponse } from '@/lib/auth-guard'

// GET /api/payments/stats - Dashboard financial statistics
export async function GET(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'FINANCE'])

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      pendingPayments,
      failedPayments,
      recentPayments,
    ] = await Promise.all([
      // Total revenue (all time)
      prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      
      // This month revenue
      prisma.payment.aggregate({
        where: { 
          status: 'PAID',
          paymentDate: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      
      // Last month revenue
      prisma.payment.aggregate({
        where: { 
          status: 'PAID',
          paymentDate: { gte: startOfLastMonth, lt: startOfMonth },
        },
        _sum: { amount: true },
      }),
      
      // Pending payments
      prisma.payment.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true,
      }),
      
      // Failed payments
      prisma.payment.aggregate({
        where: { status: 'FAILED' },
        _sum: { amount: true },
        _count: true,
      }),
      
      // Recent transactions
      prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true } },
        },
      }),
    ])

    const thisMonthAmount = monthlyRevenue._sum.amount || 0
    const lastMonthAmount = lastMonthRevenue._sum.amount || 0
    const percentChange = lastMonthAmount > 0 
      ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 
      : 0

    return jsonResponse({
      totalRevenue: totalRevenue._sum.amount || 0,
      monthlyRevenue: thisMonthAmount,
      percentChange: Math.round(percentChange * 10) / 10,
      pendingAmount: pendingPayments._sum.amount || 0,
      pendingCount: pendingPayments._count || 0,
      failedAmount: failedPayments._sum.amount || 0,
      failedCount: failedPayments._count || 0,
      recentPayments,
    })
  } catch (error) {
    if (error instanceof Response) return error
    console.error('GET /api/payments/stats error:', error)
    return errorResponse('Internal server error', 500)
  }
}
