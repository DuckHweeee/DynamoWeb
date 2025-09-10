import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  // Admin-only routes
  '/': ['Admin'],
  '/machine': ['Admin'],
  '/operator': ['Admin'],
  '/process': ['Admin'],
  '/history': ['Admin'],
  '/drawingCode': ['Admin'],
  
  // Dashboard routes (accessible to both Admin and Operator)
  '/dashboard': ['Admin', 'Operator'],
  
  // Tablet routes (accessible to both Admin and Operator)
  '/tablet/process': ['Operator', 'Admin'],
  '/tablet/newProcess': ['Operator', 'Admin'],
  '/tablet/operation': ['Operator', 'Admin'],

  // Public routes (no authentication required)
  '/login': [], 
};

// Routes that operators are completely blocked from
const adminOnlyPaths = [
  '/machine',
  '/operator', 
  '/process',
  '/history',
  '/drawingCode',
  '/group',
  '/orderDetail'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to login page and static assets
  if (pathname === '/login' || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.startsWith('/static') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get user data from cookie or headers
  const authCookie = request.cookies.get('auth-user');
  let user = null;
  
  if (authCookie) {
    try {
      user = JSON.parse(authCookie.value);
    } catch (error) {
      // Invalid cookie, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If no user is authenticated, redirect to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if operator is trying to access admin-only routes
  if (user.role === 'Operator') {
    const isAdminOnlyPath = adminOnlyPaths.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    );
    
    if (isAdminOnlyPath) {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
    
    // Redirect operators to tablet if they're on root
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/tablet/process', request.url));
    }
  }

  // For admin users, allow access to all routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
