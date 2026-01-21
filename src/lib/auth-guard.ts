import { auth } from './auth'
import { Role } from '@prisma/client'

export type AuthSession = {
  user: {
    id: string
    name: string
    email: string
    role: Role
  }
}

/**
 * Get current session - returns null if not authenticated
 */
export async function getSession(request: Request): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    
    if (!session?.user) {
      return null
    }
    
    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as { role?: Role }).role ?? 'SUPPORT',
      },
    }
  } catch {
    return null
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: Request): Promise<AuthSession> {
  const session = await getSession(request)
  
  if (!session) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  
  return session
}

/**
 * Require specific roles - throws if not authorized
 */
export async function requireRole(request: Request, allowedRoles: Role[]): Promise<AuthSession> {
  const session = await requireAuth(request)
  
  if (!allowedRoles.includes(session.user.role)) {
    throw new Response(JSON.stringify({ error: 'Forbidden: Insufficient permissions' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  
  return session
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(session: AuthSession, roles: Role[]): boolean {
  return roles.includes(session.user.role)
}

/**
 * Helper to create JSON response
 */
export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Helper to create error response
 */
export function errorResponse(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
