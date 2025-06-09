// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const COOKIE_NAME = 'user-uuid'
  const existingUUID = request.cookies.get(COOKIE_NAME)?.value

  if (!existingUUID) {
    const newUUID = uuidv4()
    response.cookies.set(COOKIE_NAME, newUUID, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1年
    })
    console.log('🆕 New UUID assigned:', newUUID)
  } else {
    console.log('✅ Existing UUID found:', existingUUID)
  }

  return response
}

// どのルートに適用するか
export const config = {
  matcher: ['/api/:path*'],
}
