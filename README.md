# Inventrack

Inventrack is an inventory management platform for tracking products, categories, stock movements, and customer orders. The repository currently contains a production-style backend API and a Next.js frontend scaffold that can be expanded into the user interface for the system.

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

| Method | Route          | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | `/login`       | Authenticate a user and issue tokens |
| POST   | `/register`    | Register a new user                  |
| POST   | `/refresh`     | Refresh an access token              |
| POST   | `/logout`      | Revoke the current session           |
| POST   | `/logout-all`  | Revoke all sessions for the user     |
| GET    | `/me`          | Return the current user profile      |
| POST   | `/create-user` | Create a user account as an admin    |

### Products

Base path: `/api/products`

| Method | Route          | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | `/`            | Create a product            |
| GET    | `/`            | List all products           |
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
| GET    | `/:productId` | Get current stock level for a product |

### Orders

Base path: `/api/orders`

| Method | Route         | Description         |
| ------ | ------------- | ------------------- |
| POST   | `/`           | Place a new order   |
| PATCH  | `/:id/cancel` | Cancel an order     |
| PATCH  | `/:id/status` | Update order status |
| GET    | `/`           | Get order history   |

## Backend Notes

- The API uses role-based access control for administrative actions.
- Prisma generates the client into `backend/src/generated/prisma`.
- The database schema is defined in `backend/prisma/schema.prisma`.
- The server boots from `backend/src/server.js` and mounts all routes through `backend/src/app.js`.

## Frontend Notes

The frontend is currently a minimal Next.js starter shell. It is ready for inventory dashboards, forms, and administrative screens, but the business UI has not been implemented yet.

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
- Frontend UI: scaffolded only
- Database: PostgreSQL via Prisma
