# 📡 API Reference

Complete API documentation for the AstralCore platform.

## 🔗 Base URL

- **Development**: \`http://localhost:3000/api\`
- **Production**: \`https://your-domain.com/api\`

## 🔐 Authentication

Most API endpoints require authentication. Include the session token in cookies or Authorization header:

\`\`\`bash
Authorization: Bearer YOUR_SESSION_TOKEN
\`\`\`

## 📝 Response Format

All API responses follow this format:

\`\`\`json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

## 🔑 Authentication Endpoints

### POST /api/auth/login

Authenticate user with email and password.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "username": "user123"
    },
    "token": "jwt-token-here"
  }
}
\`\`\`

### POST /api/auth/register

Register a new user account.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "username": "user123"
}
\`\`\`

### POST /api/auth/logout

Logout the current user.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
\`\`\`

## 👤 User Management

### GET /api/profile/update

Get current user profile.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "user123",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "country": "United States",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }
}
\`\`\`

### PUT /api/profile/update

Update user profile information.

**Request:**
\`\`\`json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "country": "United States",
    "phone": "+1234567890"
  }
}
\`\`\`

## 💰 Wallet & Trading

### GET /api/admin/wallets

Get all user wallets (Admin only).

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user-123": {
      "balances": {
        "usdt": 1000.50,
        "btc": 0.05,
        "eth": 2.5
      },
      "growth": {
        "earningsHistory": [],
        "totalEarnings": 150.25
      }
    }
  }
}
\`\`\`

### POST /api/deposit/request

Request a deposit to user wallet.

**Request:**
\`\`\`json
{
  "amount": 100,
  "currency": "USDT",
  "network": "TRC20",
  "transactionHash": "0x123..."
}
\`\`\`

### POST /api/withdraw/request

Request a withdrawal from user wallet.

**Request:**
\`\`\`json
{
  "amount": 50,
  "currency": "USDT",
  "address": "TXY123...",
  "network": "TRC20"
}
\`\`\`

## 🏆 Rewards System

### GET /api/rewards/claim

Get available rewards for user.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "available": [
      {
        "id": "reward-1",
        "title": "Welcome Bonus",
        "amount": 25,
        "currency": "USDT",
        "type": "achievement"
      }
    ],
    "claimed": [],
    "totalEarned": 0
  }
}
\`\`\`

### POST /api/rewards/claim

Claim a specific reward.

**Request:**
\`\`\`json
{
  "rewardId": "reward-1"
}
\`\`\`

## 👥 Squad System

### GET /api/squad/route

Get user's squad information.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "squad": {
      "id": "squad-123",
      "name": "Alpha Traders",
      "members": 5,
      "totalEarnings": 1250.50
    },
    "referrals": [],
    "earnings": 125.50
  }
}
\`\`\`

### GET /api/squad/clan/route

Get clan information and leaderboard.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "clans": [
      {
        "id": "clan-1",
        "name": "Elite Traders",
        "members": 25,
        "totalVolume": 50000
      }
    ]
  }
}
\`\`\`

## 💬 Support & Communication

### GET /api/support/chat

Get user's support chat history.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-1",
        "text": "Hello, I need help",
        "sender": "user",
        "timestamp": 1640995200000
      }
    ]
  }
}
\`\`\`

### POST /api/support/chat

Send a message to support.

**Request:**
\`\`\`json
{
  "message": "I need help with my withdrawal",
  "attachments": []
}
\`\`\`

### GET /api/chat/public

Get public chat messages.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-1",
        "text": "Welcome to AstralCore!",
        "username": "Admin",
        "timestamp": 1640995200000
      }
    ]
  }
}
\`\`\`

## 📊 Market Data

### GET /api/market-summary

Get market summary and trading data.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "summary": {
      "totalVolume": 1500000,
      "topGainer": "BTC",
      "topLoser": "ETH",
      "marketCap": 2500000000
    },
    "prices": {
      "BTC": 45000,
      "ETH": 3000,
      "USDT": 1
    }
  }
}
\`\`\`

## 📱 Notifications

### GET /api/notifications/clear

Get user notifications.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-1",
        "title": "Welcome",
        "content": "Welcome to AstralCore!",
        "read": false,
        "timestamp": 1640995200000
      }
    ],
    "unreadCount": 1
  }
}
\`\`\`

### POST /api/notifications/clear

Mark notifications as read.

**Request:**
\`\`\`json
{
  "notificationIds": ["notif-1", "notif-2"]
}
\`\`\`

## 🛡️ Admin Endpoints

### GET /api/admin/analytics

Get platform analytics (Admin only).

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "totals": {
      "totalUsers": 1250,
      "totalDeposits": 500000,
      "totalWithdrawals": 250000
    },
    "leaderboard": [],
    "rankChartData": []
  }
}
\`\`\`

### GET /api/admin/pending-deposits

Get pending deposits for approval (Admin only).

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "deposit-1",
      "userId": "user-123",
      "amount": 100,
      "currency": "USDT",
      "status": "pending",
      "timestamp": 1640995200000
    }
  ]
}
\`\`\`

### POST /api/admin/approve-deposit

Approve a pending deposit (Admin only).

**Request:**
\`\`\`json
{
  "depositId": "deposit-1",
  "approved": true,
  "notes": "Verified transaction"
}
\`\`\`

### GET /api/admin/verifications

Get pending user verifications (Admin only).

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "userId": "user-123",
      "status": "pending",
      "documents": {
        "identity": "passport",
        "address": "utility_bill"
      },
      "submittedAt": 1640995200000
    }
  ]
}
\`\`\`

## ⚡ Rate Limiting

API endpoints are rate limited:

- **Authentication**: 5 requests per minute
- **General API**: 100 requests per minute
- **Admin API**: 200 requests per minute

Rate limit headers:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
\`\`\`

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## 📝 Example Usage

### JavaScript/TypeScript

\`\`\`typescript
// Login user
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
if (data.success) {
  console.log('Logged in:', data.data.user);
}
\`\`\`

### cURL

\`\`\`bash
# Login
curl -X POST https://astralcore.io/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password123"}'

# Get profile (with auth)
curl -X GET https://astralcore.io/api/profile \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## 🔧 Development

### API Testing

Use the included test scripts:

\`\`\`bash
# Test all endpoints
npm run test:api

# Test specific endpoint
npm run test:api -- --grep "auth"
\`\`\`

### API Documentation

Generate API docs:

\`\`\`bash
npm run docs:api
\`\`\`

---

For more information, see the [deployment guide](./deployment-guide.md) or [contact support](mailto:support@astralcore.io).
