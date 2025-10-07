# Authentication System

This project includes a complete authentication system with JWT tokens and refresh tokens.

## Features

- ✅ User Registration & Login
- ✅ JWT Access Tokens (15 minutes)
- ✅ Refresh Tokens (7 days)
- ✅ Password Hashing with bcrypt
- ✅ Token-based Authentication Middleware
- ✅ Role-based Access Control (User, Admin, Moderator)
- ✅ Automatic Token Refresh
- ✅ Logout from All Devices
- ✅ User Profile Management
- ✅ Persian Language Support

## API Endpoints

### Authentication Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile (protected)

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "علی",
  "lastName": "احمدی",
  "phone": "09123456789"
}

Response:
{
  "success": true,
  "message": "ثبت نام با موفقیت انجام شد",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "...",
      "expiresIn": 900
    }
  }
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "ورود با موفقیت انجام شد",
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

## Frontend Usage

### Using the Auth Hook

```tsx
import { useAuthContext } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthContext();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      console.log('Login successful!');
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.firstName}!</p>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes

```tsx
import { withAuth } from '@/contexts/AuthContext';

const ProtectedPage = () => {
  return <div>This is a protected page!</div>;
};

export default withAuth(ProtectedPage);
```

## Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=mongodb://localhost:27017/tools-store
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds of 12
2. **JWT Tokens**: Short-lived access tokens (15 minutes)
3. **Refresh Tokens**: Long-lived refresh tokens (7 days)
4. **Token Versioning**: Supports logout from all devices
5. **Input Validation**: Server-side validation for all inputs
6. **Rate Limiting**: Can be added for production
7. **CORS Protection**: Configured for production use

## Database Schema

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  firstName: string (required)
  lastName: string (required)
  phone?: string (optional)
  role: 'user' | 'admin' | 'moderator' (default: 'user')
  isActive: boolean (default: true)
  emailVerified: boolean (default: false)
  tokenVersion: number (default: 1)
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}
```

## Installation

1. Install dependencies:
```bash
npm install jsonwebtoken bcryptjs @types/jsonwebtoken @types/bcryptjs
```

2. Set up environment variables
3. Run the application:
```bash
npm run dev
```

## Production Considerations

1. **Change JWT Secrets**: Use strong, random secrets
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Implement rate limiting for auth endpoints
4. **Email Verification**: Add email verification flow
5. **Password Reset**: Implement password reset functionality
6. **Audit Logging**: Log authentication events
7. **Session Management**: Consider additional session management
