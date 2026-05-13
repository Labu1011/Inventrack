# Inventrack

Inventrack is an inventory management platform for tracking products, categories, stock movements, and customer orders. The repository contains a production-style backend API and a Next.js frontend with a full set of inventory and commerce screens.

## Project Structure

- `backend/` - Express API with Prisma and PostgreSQL.
- `frontend/` - Next.js app using the App Router.

## Technology Stack

### Backend

- Node.js and Express 5
- Prisma ORM with PostgreSQL
- Zod for request validation
- JWT for authentication
- bcrypt for password hashing
- cookie-parser for refresh token/session cookie handling
- CORS and dotenv for runtime configuration

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- shadcn/ui components
- next-themes for dark mode

## Core Domain

The backend models the main inventory entities used by the application:

- Users with roles: ADMIN, MANAGER, and USER
- Categories
- Products
- Stock movements
- Orders and order items
- Refresh tokens

## API Overview

All API routes are mounted under `/api`.

### Authentication

Base path: `/api/auth`

| Method | Route              | Description                          |
| ------ | ------------------ | ------------------------------------ |
| POST   | `/login`           | Authenticate a user and issue tokens |
| POST   | `/register`        | Register a new user                  |
| POST   | `/refresh`         | Refresh an access token              |
| POST   | `/logout`          | Revoke the current session           |
| POST   | `/logout-all`      | Revoke all sessions for the user     |
| POST   | `/forgot-password` | Trigger password reset flow          |
| POST   | `/reset-password`  | Reset password with token            |
| GET    | `/me`              | Return the current user profile      |
| GET    | `/users/:id`       | Get a user by id (admin/manager)     |
| GET    | `/staff-accounts`  | List staff accounts (admin)          |
| POST   | `/create-user`     | Create a user account as an admin    |
| PATCH  | `/role/:id`        | Update a staff role (admin)          |

### Products

Base path: `/api/products`

| Method | Route          | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | `/`            | Create a product            |
| GET    | `/`            | List all products           |
| GET    | `/detail/:id`  | Get product details         |
| GET    | `/:categoryId` | List products in a category |
| PATCH  | `/:id`         | Update a product            |
| PATCH  | `/:id/delete`  | Soft-delete a product       |
| PATCH  | `/:id/restore` | Restore a deleted product   |

### Categories

Base path: `/api/categories`

| Method | Route             | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/`               | Create a category     |
| GET    | `/`               | List categories       |
| GET    | `/:id`            | Get a category by ID  |
| PATCH  | `/:id`            | Update a category     |
| PATCH  | `/:id/deactivate` | Deactivate a category |
| PATCH  | `/:id/activate`   | Reactivate a category |

### Stock Movements

Base path: `/api/stock`

| Method | Route         | Description                           |
| ------ | ------------- | ------------------------------------- |
| POST   | `/move`       | Create a stock movement               |
| GET    | `/history`    | Get stock movement history            |
| GET    | `/low-stock`  | Get low stock products                |
| GET    | `/:productId` | Get current stock level for a product |

### Orders

Base path: `/api/orders`

| Method | Route         | Description             |
| ------ | ------------- | ----------------------- |
| POST   | `/`           | Place a new order       |
| PATCH  | `/:id/cancel` | Cancel an order         |
| PATCH  | `/:id/status` | Update order status     |
| GET    | `/`           | Get order history       |
| GET    | `/my`         | Get current user orders |
| GET    | `/:id`        | Get order details       |

### Dashboard

Base path: `/api/dashboard`

| Method | Route               | Description      |
| ------ | ------------------- | ---------------- |
| GET    | `/summary`          | Summary KPIs     |
| GET    | `/sales-trend`      | Sales trend data |
| GET    | `/inventory-alerts` | Inventory alerts |
| GET    | `/top-products`     | Top products     |

## Backend Notes

- The API uses role-based access control for administrative actions.
- Prisma generates the client into `backend/src/generated/prisma`.
- The database schema is defined in `backend/prisma/schema.prisma`.
- The server boots from `backend/src/server.js` and mounts all routes through `backend/src/app.js`.

## Frontend Features

- Landing page with sections (hero, features, workflow, FAQ, about, CTA)
- Authentication screens: login, signup, forgot password, reset password
- Product browsing with cart, quantity controls, and checkout flow
- Customer order history and cancellations
- User profile view
- Admin/Manager dashboard with KPIs, charts, and data tables
- Category management with activate/deactivate and inline edits
- Product management with create/edit/restore/delete and filtering
- Stock movement history, filters, and low stock list with quick movement creation
- Order management with status updates and filters
- Staff management: create staff accounts and manage roles
- Role-based quick create in the sidebar and a light/dark theme toggle

## Running The Project

From the current workspace, the backend and frontend are managed as separate apps.

### Backend

1. Install dependencies in `backend/`.
2. Configure the PostgreSQL connection and required auth environment variables.
3. Run the development server with the backend dev script.

### Frontend

1. Install dependencies in `frontend/`.
2. Run the Next.js development server from the frontend directory.

## Status

- Backend API: implemented
- Frontend UI: implemented with inventory and commerce flows
- Database: PostgreSQL via Prisma
