# 📦 Inventory Management System API

A multi-tenant Inventory Management System built with **Node.js, Express, Sequelize, and MySQL (TiDB Cloud)**.

Supports:
- ✅ Multi-store (multi-tenant) architecture
- ✅ Role-based access control (Owner, Admin, Manager, Attendant)
- ✅ Product & Category management
- ✅ Supplier management
- ✅ Inventory tracking (stock in/out)
- ✅ Atomic sales transactions
- ✅ Dashboard & reports
- ✅ Swagger API documentation
- ✅ Rate limiting & security

---

# 🚀 Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL (TiDB Cloud)
- JWT Authentication
- Express Validator
- Swagger (OpenAPI)
- Nodemailer
- Helmet
- Morgan
- Express Rate Limit

---

# 🏗️ Architecture Overview

This system uses **single database multi-tenancy**.

Each store has:
- Its own users
- Its own products
- Its own suppliers
- Its own sales
- Its own inventory logs

All queries are filtered by `req.user.storeId`. Stores never see each other’s data.

---

# 🔐 Authentication & Roles

## Roles

| Role | Permissions |
| --- | --- |
| owner | Full access |
| admin | Full access except store ownership |
| manager | Manage products, categories, suppliers, inventory |
| attendant | Record sales only |

---

# 🧾 Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
DB_HOST=your_tidb_host
DB_PORT=4000
DB_USER=your_tidb_username
DB_PASS=your_tidb_password
DB_NAME=inventory
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

---

# ▶️ Running The Project

```bash
npm install
npm run dev
```

API runs on:
`http://localhost:3000`

Swagger docs:
`http://localhost:3000/api-docs`

---

# 📚 API Endpoints

## 🔐 Authentication

### Register Owner
`POST /api/auth/register`

```json
{
  "fullName": "John Owner",
  "storeName": "John Electronics",
  "phoneNumber": "08012345678",
  "email": "john@business.com",
  "password": "123456"
}
```

### Login
`POST /api/auth/login`

### Create Employee
`POST /api/auth/create-employee`  
*Roles allowed:* owner, admin

### Forgot Password
`POST /api/auth/forgot-password`

### Reset Password
`POST /api/auth/reset-password/:token`

### Change Password
`POST /api/auth/change-password`

---

## 📂 Categories

| Method | Endpoint |
| --- | --- |
| POST | /api/categories |
| GET | /api/categories |
| GET | /api/categories/:id |
| PATCH | /api/categories/:id |
| DELETE | /api/categories/:id |

---

## 🏢 Suppliers

| Method | Endpoint |
| --- | --- |
| POST | /api/suppliers |
| GET | /api/suppliers |
| GET | /api/suppliers/:id |
| PATCH | /api/suppliers/:id |
| DELETE | /api/suppliers/:id |

---

## 📦 Products

Supports pagination, search, filtering.

| Method | Endpoint |
| --- | --- |
| POST | /api/products |
| GET | /api/products |
| GET | /api/products/:id |
| PATCH | /api/products/:id |
| DELETE | /api/products/:id |

**Query Parameters:**
`?page=1&limit=10&search=coca&categoryId=uuid`

---

## 📊 Inventory

### Stock In
`POST /api/inventory/:productId/stock-in`

### Stock Out
`POST /api/inventory/:productId/stock-out`

### Get All Logs
`GET /api/inventory/logs?page=1&limit=10`

### Get Product Logs
`GET /api/inventory/logs/:productId?page=1&limit=10`

### Low Stock
`GET /api/inventory/low-stock`

---

## 💰 Sales

### Record Sale (Atomic Transaction)
`POST /api/sales`

```json
{
  "paymentMethod": "cash",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

This will:
- ✅ Verify stock
- ✅ Create sale
- ✅ Create sale items
- ✅ Deduct stock
- ✅ Create inventory log
- ✅ Return low stock warnings if needed

### Get All Sales
`GET /api/sales?page=1&limit=10`

### Get Single Sale
`GET /api/sales/:id`

---

## 📈 Reports

### Dashboard Summary
`GET /api/dashboard/summary`

Returns:
- Total products
- Total inventory value
- Today's sales count
- Today's revenue
- Low stock count

### Sales Report
`GET /api/reports/sales?period=daily&page=1&limit=10`

Periods:
- daily
- weekly
- monthly

### Best Sellers
`GET /api/reports/best-sellers?limit=10`

---

# 🔒 Security Features

- JWT Authentication
- Role-Based Access Control
- Multi-Tenant Data Isolation
- Express Rate Limiting
- Helmet Security Headers
- Input Validation
- Global Error Handler
- Transaction-safe sales operations

---

# 🧠 Multi-Tenancy Strategy

Each request:
`req.user.storeId`

All database queries use:
`where: { storeId }`

Ensuring full data isolation.

---

# ✅ Features Implemented

- Multi-store support
- Full CRUD modules
- Inventory tracking
- Sales engine with transactions
- Reports & dashboard
- Email notifications
- Pagination & filtering
- Swagger documentation

---

# 🚀 Deployment (Render)

1. Push project to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables
5. Deploy

---

# 👥 Team Notes

- Product module fully integrated
- Inventory logs paginated
- Sales transactions atomic
- All endpoints tested
- Production-ready structure

---

# 🏁 Status

✅ Backend Complete  
✅ Tested  
✅ Ready For Frontend Integration  
✅ Ready For Deployment
