# Quick-Kart

Quick-Kart is a full-stack grocery marketplace where shoppers, sellers, and admins share a single platform. The frontend is a Vite + React SPA, while the backend is a modular Express API backed by MongoDB. Media uploads go through Cloudinary, OTP/notification emails use Nodemailer, and online payments run through Razorpay.

## Features
- **Shoppers** – OTP-based registration, login, profile photo upload, cart syncing, saved addresses, COD/Razorpay checkout, reviews, and order history.
- **Sellers** – Dedicated dashboard for product submissions (with admin approval), inventory toggles, and order visibility.
- **Admins** – Cookie-authenticated portal to review/approve products, inspect/update orders, and manage the catalog.
- **Platform services** – Cloudinary uploads, Razorpay order creation, email-based OTP verification, secure JWT cookies, and configurable DNS/timeout safeguards.

## Tech Stack
- **Frontend**: React 19, React Router 7, Tailwind (via `@tailwindcss/vite`), Axios, React Hot Toast.
- **Backend**: Node 18+, Express 5, Mongoose 8, JWT, Multer, Cloudinary SDK, Nodemailer, Razorpay SDK.
- **Infrastructure**: MongoDB Atlas (or local), Cloudinary, Razorpay, SMTP provider for OTP mailers.

## Project Structure
```
backend/
  controller/   # auth, products, orders, addresses, reviews, cart
  routes/       # versioned routers mounted under /api/v1
  models/       # Address, Order, Product, Review, User schemas
  middlewares/  # JWT auth for users/admins
  utils/        # db, cloudinary, multer config
  services/     # nodemailer wrapper
frontend/
  src/
    context/    # global app state + axios defaults
    pages/      # home, cart, profile, seller/admin flows
    components/ # shared UI + admin widgets
    utils/      # Razorpay loader
```

## Local Setup
### Prerequisites
- Node.js 18+ (ESM + Vite compatibility)
- MongoDB URI (Atlas or local)
- Cloudinary account (cloud name + API keys)
- Razorpay account (key + secret) *(optional if you only test COD)*
- SMTP credentials for OTP emails

### Environment Variables
Create `backend/.env`:
```
PORT=5000
MONGO_URI=...
SECRET_KEY=...
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=supersecret
CLOUD_NAME=...
API_KEY=...
API_SECRET=...
RAZORPAY_KEY=...
RAZORPAY_SECRET=...
MAIL_HOST=smtp.example.com
MAIL_USER=you@example.com
MAIL_PASS=mail-password
NODE_ENV=development
```

Create `frontend/.env`:
```
VITE_BACKEND_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxx   # optional if COD-only
VITE_CURRENCY=₹
```

### Install & Run
```bash
git clone https://github.com/adarshaady17/Quick-Kart.git
cd Quick-Kart

# Backend API
cd backend
npm install
npm run dev   # nodemon + Express

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev   # starts Vite on http://localhost:5173
```
Adjust `FRONTEND_URL`/`VITE_BACKEND_URL` if you change ports.

## Core Flows
- **Auth & Profiles**: Users register with role (`user` or `seller`), receive OTP emails, and authenticate via HTTP-only JWT cookies. Profile photos are uploaded through Cloudinary (`/api/v1/user/profile/photo`). [`backend/controller/user.controller.js`](backend/controller/user.controller.js)
- **Catalog**: Sellers upload products with multiple images (batched uploads + local cleanup) that stay `pending` until an admin approves them. Approved products feed the storefront lists and filtering UI. [`backend/controller/product.controller.js`](backend/controller/product.controller.js)
- **Cart & Checkout**: Cart state is mirrored server-side for authenticated users. Checkout supports COD (`/api/v1/order/cod`) or Razorpay (`/api/v1/order/razor`), with addresses pulled from `/api/v1/address/get`. Frontend logic lives in `frontend/src/pages/cart.jsx`.
- **Orders**: Users can review their history, while admins and sellers inspect aggregate order data. Admins can update statuses via `/api/v1/admin/orders/:id/status`.
- **Reviews**: Authenticated users can post/update a single review per product, and product pages aggregate the rating summaries.

## API Highlights
| Area | Method & Path | Description |
| --- | --- | --- |
| Auth | `POST /api/v1/user/register` | Register & trigger OTP |
|  | `POST /api/v1/user/verify-otp` | Verify OTP + issue JWT |
|  | `POST /api/v1/user/login` | Role-aware login |
|  | `GET /api/v1/user/logout` | Clear JWT cookie |
| Products | `POST /api/v1/product/add` | Seller upload (multipart) |
|  | `GET /api/v1/product/list` | Public approved catalog |
|  | `POST /api/v1/product/stock` | Seller toggle inventory |
|  | `GET /api/v1/admin/products/pending` | Admin review queue |
| Orders | `POST /api/v1/order/cod` | Cash-on-delivery order |
|  | `POST /api/v1/order/razor` | Create Razorpay order |
|  | `GET /api/v1/order/user` | Logged-in user orders |
|  | `GET /api/v1/order/seller` | Seller/admin order feed |
| Addresses | `POST /api/v1/address/add` | Save shipping address |
|  | `GET /api/v1/address/get` | List saved addresses |
| Cart | `POST /api/v1/cart/update` | Persist cart quantities |
| Reviews | `POST /api/v1/review` | Add/update review |
|  | `GET /api/v1/review/:productId` | Fetch product reviews |

All endpoints are mounted in `backend/index.js` under `/api/v1/*` with JSON body limits, extended timeouts, and custom DNS servers for Atlas stability.

## Frontend Highlights
- Responsive landing, category filters, best sellers, and search-driven `AllProducts` grid.
- `AppContext` centralizes user, admin, seller, cart, and product state, and configures Axios with `VITE_BACKEND_URL`.
- Seller portal (`/seller/*`) guards routes by user role and exposes product + order tooling.
- Admin portal (`/admin/*`) switches between approval queues, live catalog, outstanding orders, and stock view.
- Cart and product flows integrate Razorpay dynamically via `loadRazorpay.js`.

## Data Models
- **User** – role (`user`/`seller`), OTP fields, cartItems snapshot, profile photo (`cloudinary`). Emails send automatically when OTP changes.
- **Product** – description array, pricing, multiple images, status, seller ref, and rejection reasons.
- **Order** – nested line items, tax-inclusive totals, COD vs online, status lifecycle, address reference, paid flag.
- **Address** – normalized shipping info keyed by user.
- **Review** – per-product-per-user unique rating/comment with aggregates returned via API.

## Deployment
- **Frontend**: https://quick-kart-two.vercel.app
- **Backend**: https://quick-kart-navj.onrender.com

Ensure environment variables match production domains (e.g., `FRONTEND_URL=https://quick-kart-two.vercel.app`) so cookies and CORS remain valid.

## Useful Commands
| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm run dev` | Start Express with Nodemon |
| backend | `npm start` | Start Express without watcher (deployment) |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm run preview` | Preview built assets |

---
Questions or deployment issues? Open an issue on GitHub or reach out via the contact info tied to your deployment credentials.