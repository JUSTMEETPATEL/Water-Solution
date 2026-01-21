import { auth } from '@/lib/auth'

export async function POST() {
  try {
    // Create admin user using Better-auth's internal method
    const response = await auth.api.signUpEmail({
      body: {
        email: 'test@test.com',
        password: '12345678',
        name: 'Test Admin',
      },
    })

    return Response.json({ success: true, user: response })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
