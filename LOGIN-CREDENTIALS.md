# 🔐 AstralCore Login Credentials

## Test Accounts

### Admin Account

- **Email**: `admin@astralcore.io`
- **Password**: `admin`
- **Access**: Full admin panel access

### Moderator Account

- **Email**: `moderator@astralcore.io`
- **Password**: `moderator`
- **Access**: Moderator panel access

### Regular User Account

- **Email**: Any valid email (e.g., `user@example.com`)
- **Password**: Any password
- **Access**: Dashboard access

## How to Login

1. Go to `/login` page
2. Enter one of the above credentials
3. Click "Sign In"
4. You'll be redirected to the appropriate dashboard

## Login Flow

1. **Login Form** validates credentials
2. **Authentication** checks against mock database
3. **Cookies** are set for session management
4. **Middleware** verifies authentication
5. **Redirect** to dashboard or admin panel

## Troubleshooting

If login doesn't work:

1. **Clear Browser Cookies**: Go to Developer Tools → Application → Cookies and clear all cookies
2. **Check Console**: Look for any JavaScript errors
3. **Try Different Email**: Use `test@example.com` with any password
4. **Hard Refresh**: Press Ctrl+F5 (or Cmd+Shift+R on Mac)

## Features After Login

### Regular Users Get:

- Portfolio management
- Trading bot controls
- Market analysis
- Deposit/withdraw functionality
- Profile management

### Admins Get:

- All user features +
- User management
- Platform analytics
- System configuration
- Security monitoring

### Moderators Get:

- User features +
- Content moderation
- User verification
- Support ticket management

---

**Note**: This is a demo authentication system. In production, you would integrate with a real authentication provider like Auth0, Firebase Auth, or a custom backend.
