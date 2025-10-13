// Test login API endpoint format
// This file documents the expected API request/response format

// POST /api/auth/login
// Request Body:
// {
//   "email": "huy",
//   "password": "12345"
// }

// Expected Response Format:
// {
//   "id": "string",
//   "username": "string", 
//   "email": "string",
//   "fullname": "string",
//   "role": [
//     {
//       "id": number,
//       "name": "ROLE_ADMIN" | "ROLE_USER" | "ROLE_MANAGER"
//     }
//   ],
//   "createdDate": "string",
//   "updatedDate": "string"
// }

// The AuthContext will transform this into our User interface:
// {
//   id: string;
//   username: string;
//   email: string;
//   fullname: string;
//   role: "Admin" | "Operator";  // Simplified role
//   roles: Array<{ id: number; name: string }>; // Full role array
// }

export const LOGIN_API_INFO = {
  endpoint: '/api/auth/login',
  method: 'POST',
  requestFormat: {
    email: 'string',
    password: 'string'
  }
};