Tech stack : 
- **Runtime** - Node.js
- **Framework** - Express.js
- **Database** - MongoDB Atlas
- **ODM** - Mongoose
- **Authentication** - JWT (jsonwebtoken)
- **Password Hashing** - bcryptjs
- **Deployment** - Render

Live API: https://finance-tracker-backend-1pry.onrender.com

-----------
Project Structure : 
BACKEND/
  -  model/
      ── usermodel.js
      ── transactionmodel.js
     
  -  middleware/
      ── auth.js
      ── rolecheck.js
     
  -  controller/
      ── authcontroller.js
      ── usercontroller.js
      ── transactioncontroller.js
      ── dashboardcontroller.js

   -  router/
      ── auth.router.js
      ── user.router.js
      ── transaction.router.js
      ── dashboard.router.js
  -   server.js


---
## Roles and Permissions

The system has three roles — **Admin**, **Analyst**, and **Viewer**.

**Admin** has full access. Admin can view the dashboard, view and manage transactions (create, update, delete), and manage users including assigning roles and toggling user status.

**Analyst** can view the dashboard and browse all transactions but cannot create, update, or delete any records. Analyst also has no access to user management.

**Viewer** can only view the dashboard summary. Viewers cannot access transactions or user management at all.

---

## What I Implemented Beyond Basic Requirements

**Soft Delete** — Transactions are never permanently deleted. I used an `isDeleted` flag so financial history is always preserved. Deleted records are simply filtered out from queries using `{ isDeleted: false }`.

**Pagination** — Transaction listing supports `?page=1&limit=10` so the API can handle large datasets efficiently without returning everything at once.

**Search** — Transactions can be searched by notes using `?search=keyword`. This uses MongoDB regex for case-insensitive matching.

**Input Validation** — Every controller checks required fields before processing and returns clear error messages with correct HTTP status codes.

**User Status** — Admin can set users as `active` or `inactive`. Inactive users cannot login even with correct credentials.

---

## Assumptions Made

- Public registration is allowed but all new accounts default to `viewer` role. Admin manually upgrades roles from the user management panel. This keeps the system flexible for demo while maintaining access control.
- Soft delete was chosen over hard delete to preserve financial data integrity.
- Dashboard APIs are accessible to all roles including viewer, since the requirement stated "Viewer can only view dashboard data".

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@finance.com | password123 |
| Analyst | analyst@finance.com | password123 |
| Viewer | viewer@finance.com | password123 |

---

### How I implemented this:

I created two middleware files:

**auth.js** - Verifies JWT token on every protected route:
```javascript
const decoded = jwt.verify(token,JWT_SECRET);
req.user = decoded;
next();
```

**rolecheck.js** - Checks if user has required role:
```javascript
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
```

Every route uses both middleware like this:
```javascript
router.post("/postdata", verifyToken, roleCheck("admin"), createTransaction);
router.get("/getdata", verifyToken, roleCheck("admin", "analyst"), getAllTransactions);
```

---

## Data Models

### User
```javascript
{
  name: String,       // required
  email: String,      // required, unique
  password: String,   // hashed with bcrypt
  role: String,       // admin | analyst | viewer
  status: String,     // active | inactive
  timestamps: true
}
```

### Transaction
```javascript
{
  user: ObjectId,     // who created it
  amount: Number,     // required
  type: String,       // income | expense
  category: String,   // required
  date: Date,         // defaults to today
  notes: String,
  isDeleted: Boolean, // soft delete, default false
  timestamps: true
}
```

---

### Auth
POST /auth/register    → create account (defaults to viewer role)
POST /auth/login       → login and get token
---
### Users (Admin only)
GET    /user/getdata          → get all users
GET    /user/getdata/:id      → get single user
PUT    /user/updatedata/:id   → update role or status
DELETE /user/deletedata/:id   → delete user

### Transactions (Admin + Analyst)
POST   /transaction/postdata          → create (admin only)
GET    /transaction/getdata           → get all with filters
GET    /transaction/getdata/:id       → get single
PUT    /transaction/updatedata/:id    → update (admin only)
DELETE /transaction/deletedata/:id    → soft delete (admin only)

Dashboard APIs :
### Dashboard (All roles)
GET /dashboard/summary           → total income, expense, balance
GET /dashboard/category-totals   → spending by category
GET /dashboard/monthly-trends    → income vs expense by month
GET /dashboard/recent-activity   → last 10 transactions

### Filtering :
type=income
category=Salary
page=1&limit=10
---

## To Run Locally

git clone https://github.com/yourusername/finance-tracker-backend.git
cd backend
npm install
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET= secret_key

npm run dev
```
## Authentication Works

- User logs in
- Server returns a **JWT token**
- Token is sent in every protected request :
      - Token expires in 7 days
      - Passwords are hashed using **bcrypt** before storing
---
