import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'


/**
 * Middleware function to handle incoming requests and update the session.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<void>} A promise that resolves when the session is updated.
 */
export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}