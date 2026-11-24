# Scented Candle Inventory and Raw Materials Tracking System

A backend prototype for ITEC 116 (Systems Integration and Architecture 2).
It helps a small candle-making business track raw materials, suppliers, candle
products, recipes, and production batches. Recording a production batch
automatically deducts the raw materials used and adds to the finished candle stock.

## Tech Stack
- NestJS (backend framework)
- TypeORM (ORM)
- MySQL (database)
- JWT authentication, bcrypt password hashing, class-validator input validation
- Postman (API testing)

## Features
- Login with JWT, protected routes, and two roles: Admin and Staff
- Raw materials, suppliers, products, and recipe management
- Low-stock filter for raw materials
- Production logs with automatic stock deduction (all-or-nothing transaction)
- Admin-only user management
- Standard error response format

## API Endpoints
Base path: `/api/v1`

| Module | Endpoints |
|---|---|
| Auth | `POST /auth/login` |
| Raw materials | `GET /raw-materials`, `GET /raw-materials?lowStock=true`, `GET /raw-materials/:id`, `POST`, `PATCH /:id`, `DELETE /:id` |
| Suppliers | `GET /suppliers`, `GET /suppliers/:id`, `POST`, `PUT /:id` |
| Products | `GET /products`, `GET /products/:id`, `POST`, `PATCH /:id`, `GET /products/:id/materials`, `POST /products/:id/materials` |
| Production logs | `GET /production-logs`, `POST /production-logs` |
| Users (Admin only) | `GET /users`, `POST /users` |

## How to Run Locally
1. Install Node.js (LTS) and MySQL.
2. Create an empty database named `candle_inventory`.
3. Clone this repository and run `npm install`.
4. Copy `.env.example` to `.env` and fill in your MySQL settings, a `JWT_SECRET`,
   and the first Admin account (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
5. Run `npm run start:dev`. The tables are created automatically, and the first
   Admin account is created on the first start.
6. The API runs at `http://localhost:3000/api/v1`. Test it with the Postman collection.

## Roles
- **Admin:** full access, including creating or deleting data and managing users
- **Staff:** view data, update raw material stock, and record production

## Future Improvements
- Email alerts when a raw material reaches its reorder level
- CSV import/export of stock
- A web frontend