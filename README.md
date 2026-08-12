# Mini ERP + CRM Operations Portal

This is a comprehensive Mini ERP and CRM Operations Portal, built with a modern tech stack.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React
- **Backend:** Node.js, Express, TypeScript, Supabase, PostgreSQL, JWT for authentication

## Project Structure

The repository is divided into two main parts:
- `/frontend` - Contains the Vite/React application.
- `/backend` - Contains the Node.js/Express API.

---

## Local Development Setup

### Quick Start (Root Directory)

You can run both the frontend and backend simultaneously from the root directory:

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
2. **Start both development servers concurrently:**
   ```bash
   npm run dev
   ```

---

### Individual Setup (If needed)

#### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file based on the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Required Variables:*
   - `PORT`: Port for the API to run on (default `5000`)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon public key
   - `JWT_SECRET`: Secret key for JWT signing
   - `DATABASE_URL`: PostgreSQL connection string

4. **Initialize Database (Optional/If applicable):**
   ```bash
   npm run db:init
   ```
5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file based on the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Required Variables:*
   - `VITE_API_URL`: URL of the backend API (e.g., `http://localhost:5000/api`)

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The web application will be available at `http://localhost:5173` (or the port Vite outputs).

---

## Deployment Documentation

### Deploying the Backend (e.g., on Render, Heroku, or DigitalOcean)

1. **Build the Application:**
   Run the build script to compile TypeScript to JavaScript.
   ```bash
   npm run build
   ```
2. **Environment Variables:**
   Ensure all the production environment variables (from `.env.example`) are securely added to your hosting provider's dashboard.
3. **Start Command:**
   Configure your hosting provider to start the application using:
   ```bash
   npm start
   ```
   (This runs `node dist/index.js`).

### Deploying the Frontend (e.g., on Vercel or Netlify)

This project includes a `vercel.json` for easy deployment to Vercel, ensuring that client-side routing works correctly.

1. **Vercel Deployment:**
   - Connect your GitHub repository to Vercel.
   - Set the Root Directory to `frontend`.
   - The Build Command should automatically be detected as `npm run build` (`tsc -b && vite build`).
   - The Output Directory should automatically be detected as `dist`.
   - **Environment Variables:** Add `VITE_API_URL` pointing to your deployed production backend URL (e.g., `https://your-backend.onrender.com/api`).
2. **Other Static Hosting:**
   If deploying to other platforms, ensure you configure URL rewrites/redirects to serve `index.html` for all paths (`/*`) to support React Router.

---

## Submission Details

- **GitHub Repository:** [https://github.com/SHASHANKKUMARRAJP/Infotech.git](https://github.com/SHASHANKKUMARRAJP/Infotech.git)
- **Live Frontend URL:** [https://infotech-iota.vercel.app/](https://infotech-iota.vercel.app/)
- **Live Backend API URL:** [https://infotech-29c7.onrender.com](https://infotech-29c7.onrender.com)
- **Postman Collection:** Included in the root directory as `Infotech_API.postman_collection.json`.

### Test Login Credentials
*(Note: Please ensure these users exist in your deployed database or adjust them to match your seeded data.)*
- **Admin:** `admin@example.com` / `password123`
- **Sales:** `sales@example.com` / `password123`
- **Warehouse:** `warehouse@example.com` / `password123`
- **Accounts:** `accounts@example.com` / `password123`

### Architecture Overview
This project uses a decoupled Client-Server architecture:
- **Frontend (Client):** A React application built with Vite and styled using Tailwind CSS. It communicates with the backend via RESTful APIs using Axios. React Router is used for client-side navigation.
- **Backend (Server):** A Node.js and Express application written in TypeScript. It handles business logic, authentication (JWT), and API routing.
- **Database:** PostgreSQL hosted on Supabase, managed and queried using the `pg` driver and Supabase JS client.

### Known Limitations / Incomplete Parts
- **Error Handling:** Basic error handling is implemented; advanced centralized error handling and logging (e.g., Winston) are not fully robust.
- **Rate Limiting:** No rate limiting or DDOS protection is currently configured on the API.
- **Pagination:** List endpoints (e.g., fetching all customers or products) do not yet implement pagination, which could impact performance with large datasets.
- **Testing:** Comprehensive unit and integration tests (e.g., Jest) are currently missing.
