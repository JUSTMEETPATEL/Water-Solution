import { prisma } from '@/lib/prisma'
import { jsonResponse, errorResponse, getSession } from '@/lib/auth-guard'

// GET /api/notifications - Get notifications for a customer
export async function GET(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (customerId) where.customerId = customerId
    if (unreadOnly) where.isRead = false

    const notifications = await prisma.notification.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true } },
      },
    })

    return jsonResponse(notifications)
  } catch (error) {
    console.error('GET /api/notifications error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/notifications - Create notification (internal use)
export async function POST(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    
    if (!body.customerId || !body.type || !body.message) {
      return errorResponse('Missing required fields', 400)
    }

    const notification = await prisma.notification.create({
      data: {
        customerId: body.customerId,
        type: body.type,
        message: body.message,
      },
    })

    return jsonResponse(notification, 201)
  } catch (error) {
    console.error('POST /api/notifications error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const session = await getSession(request)
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const body = await request.json()
    const { ids } = body as { ids?: string[] }

    if (!ids || !Array.isArray(ids)) {
      return errorResponse('Invalid notification IDs', 400)
    }

    await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { isRead: true },
    })

    return jsonResponse({ success: true, updated: ids.length })
  } catch (error) {
    console.error('PATCH /api/notifications error:', error)
    return errorResponse('Internal server error', 500)
  }
}
