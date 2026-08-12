# Infotech API Documentation

This document outlines all the REST API endpoints available in the Mini ERP + CRM Operations Portal.

## Base URL
- **Local:** `http://localhost:5000`
- **Production:** `https://infotech-29c7.onrender.com`

---

## Authentication (`/api/auth`)

### `POST /api/auth/login`
- **Description:** Authenticate a user and receive a JWT token.
- **Body:** `{ "email": "admin@minierp.com", "password": "password123" }`

### `POST /api/auth/register`
- **Description:** Register a new user.
- **Body:** `{ "email": "test@minierp.com", "password": "password123", "name": "Test User", "role": "SALES" }`

### `GET /api/auth/me`
- **Description:** Get details of the currently authenticated user.
- **Headers:** `Authorization: Bearer <token>`

---

## Customers (`/api/customers`)
*Requires `Authorization: Bearer <token>` for all routes.*

### `GET /api/customers`
- **Description:** Retrieve a list of all customers.

### `POST /api/customers`
- **Description:** Create a new customer.
- **Body:** `{ "name": "Acme Corp", "email": "contact@acmecorp.com", "phone": "+1-555-0198", "address": "123 Business Rd." }`

### `GET /api/customers/:id`
- **Description:** Get specific customer details by ID.

### `PUT /api/customers/:id`
- **Description:** Update customer information.
- **Body:** `{ "name": "Acme Corporation Updated" }`

### `DELETE /api/customers/:id`
- **Description:** Delete a customer (Admin only).

### `GET /api/customers/:id/followups`
- **Description:** Retrieve followups for a specific customer.

### `POST /api/customers/:id/followups`
- **Description:** Create a new followup for a customer.
- **Body:** `{ "notes": "Called customer to discuss new pricing", "status": "COMPLETED" }`

---

## Products (`/api/products`)
*Requires `Authorization: Bearer <token>` for all routes.*

### `GET /api/products`
- **Description:** Retrieve all products.

### `POST /api/products`
- **Description:** Create a new product.
- **Body:** `{ "name": "Widget A", "sku": "WDG-A-01", "description": "A very useful widget", "price": 19.99, "category": "Widgets" }`

### `GET /api/products/:id`
- **Description:** Get a single product by ID.

### `PUT /api/products/:id`
- **Description:** Update product details.
- **Body:** `{ "price": 24.99 }`

---

## Inventory (`/api/inventory`)
*Requires `Authorization: Bearer <token>` for all routes.*

### `POST /api/inventory/move`
- **Description:** Record an inventory movement (IN/OUT).
- **Body:** `{ "product_id": 1, "quantity": 50, "type": "IN", "reference": "PO-1234" }`

### `GET /api/inventory/movements`
- **Description:** Get all inventory movement history.

---

## Challans (`/api/challans`)
*Requires `Authorization: Bearer <token>` for all routes.*

### `GET /api/challans`
- **Description:** Retrieve all challans (delivery/receipt notes).

### `POST /api/challans`
- **Description:** Create a new challan.
- **Body:** `{ "customer_id": 1, "type": "DELIVERY", "items": [ { "product_id": 1, "quantity": 10, "price": 19.99 } ] }`

### `GET /api/challans/:id`
- **Description:** Retrieve specific challan details.

### `PUT /api/challans/:id`
- **Description:** Update a challan.

### `PUT /api/challans/:id/confirm`
- **Description:** Confirm a challan, affecting inventory automatically.

### `PUT /api/challans/:id/cancel`
- **Description:** Cancel a challan.

---

## Users (`/api/users`)
*Requires `Authorization: Bearer <token>` for all routes. (Mostly Admin restricted)*

### `GET /api/users`
- **Description:** Retrieve all users in the system.

### `POST /api/users`
- **Description:** Create a new user (Dashboard creation).

### `GET /api/users/:id`
- **Description:** Get specific user details.

### `PUT /api/users/:id`
- **Description:** Update a user.

### `DELETE /api/users/:id`
- **Description:** Delete a user.

---

## Dashboard (`/api/dashboard`)
*Requires `Authorization: Bearer <token>` for all routes.*

### `GET /api/dashboard`
- **Description:** Retrieve aggregate metrics and data for the overview dashboard.
