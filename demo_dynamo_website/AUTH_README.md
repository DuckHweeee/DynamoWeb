# Authentication & Authorization System

This project now includes a comprehensive authentication and authorization system with role-based access control.

## Features

- **Two User Roles**: Admin and Operator
- **Route Protection**: Middleware-based route protection
- **Role-based Access**: Different access levels for different roles
- **Automatic Redirection**: Users are redirected based on their roles
- **Persistent Sessions**: Authentication state persists across browser sessions

## User Roles

### Admin
- **Full Access**: Can access all pages and features
- **Default Route**: Redirected to `/` (main dashboard) after login
- **Available Pages**: 
  - Dashboard (`/`)
  - Machine Management (`/machine`)
  - Operator Management (`/operator`)
  - Process Management (`/process`)
  - History (`/history`)
  - Drawing Code (`/drawingCode`)
  - Tablet View (`/tablet`) - Also accessible by Admin

### Operator
- **Limited Access**: Can only access tablet pages
- **Default Route**: Redirected to `/tablet` after login
- **Available Pages**:
  - Tablet Process (`/tablet/process`)
  - Tablet New Process (`/tablet/newProcess`)
  - Tablet Operation (`/tablet/operation`)
- **Blocked Pages**: All admin pages (redirected to access denied)

## Demo Credentials

```
Admin:
- Username: admin
- Password: password123

Operator:
- Username: operator
- Password: password123
```

## How It Works

### 1. Middleware Protection (`middleware.ts`)
- Intercepts all requests before they reach pages
- Checks for authentication cookies
- Redirects unauthenticated users to login
- Blocks operators from accessing admin pages
- Redirects operators to tablet if they try to access root

### 2. Context-based Authentication (`contexts/AuthContext.tsx`)
- Manages authentication state
- Handles login/logout functionality
- Syncs with localStorage and cookies
- Provides user information throughout the app

### 3. Route Protection Components (`components/ProtectedRoute.tsx`)
- Client-side route protection
- Role-based component rendering
- Loading states during authentication checks

### 4. Automatic Redirects
- **Operators** trying to access admin pages → Access Denied page
- **Unauthenticated users** → Login page
- **Successful login** → Role-appropriate dashboard

## Key Files

- `middleware.ts` - Server-side route protection
- `contexts/AuthContext.tsx` - Authentication context provider
- `components/ProtectedRoute.tsx` - Client-side route protection
- `components/login-form.tsx` - Updated login form with authentication
- `app/access-denied/page.tsx` - Access denied page for unauthorized access
- `hooks/useAuth.ts` - Authentication utility hooks

## Usage

### Protecting Routes
Routes are automatically protected by middleware. No additional configuration needed.

### Checking User Role in Components
```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user } = useAuth();
  
  if (user?.role === "Admin") {
    return <AdminContent />;
  }
  
  return <OperatorContent />;
}
```

### Manual Route Protection
```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminContent />
    </ProtectedRoute>
  );
}
```

## Security Notes

- This is a demo implementation with mock authentication
- In production, replace with real API authentication
- Consider implementing JWT tokens or session-based auth
- Add password hashing and proper validation
- Implement refresh tokens for better security

## Integration with Existing Backend

To integrate with your existing backend:

1. Replace mock users in `AuthContext.tsx` with real API calls
2. Update login function to call your authentication endpoint
3. Modify user structure to match your backend response
4. Add proper error handling and validation
5. Implement token refresh if using JWT

## Testing

1. Start the development server: `npm run dev`
2. Navigate to any protected route - you'll be redirected to login
3. Login with admin credentials - access all pages
4. Login with operator credentials - only access tablet pages
5. Try accessing admin pages as operator - get access denied
