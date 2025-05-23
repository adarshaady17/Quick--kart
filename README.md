# Quick-Kart


Grocery E-Commerce Website 
Project Overview
This is a full-stack grocery e-commerce platform with the following features:

Frontend: Modern UI built with React.js

Backend: Node.js with Express.js

Database: MongoDB for data storage

Image Storage: Cloudinary for product images

Payment Gateway: Razorpay integration

Email Service: Nodemailer for order confirmations and notifications

Features
User Features
User registration and authentication

Product browsing and search

Shopping cart functionality

Checkout process with multiple payment options

Order history and tracking

User profile management

Admin Features
Product management

Order management

User management

Sales analytics dashboard

Inventory management

Technologies Used
Frontend
React.js

Redux (for state management)

Axios (for API calls)

React Router (for navigation)

Backend
Node.js

Express.js

MongoDB (with Mongoose ODM)

JSON Web Tokens (JWT for authentication)

Bcrypt (for password hashing)

Services
Cloudinary (for image storage)

Razorpay (for payments)

Nodemailer (for email notifications)

Setup Instructions
Prerequisites
Node.js (v14 or higher)

MongoDB Atlas account or local MongoDB installation

Cloudinary account

Razorpay account

Email service credentials for Nodemailer


bash
# Install backend dependencies
cd backend
npm install mongoose cors cookie parcer jwt 
start npm run dev

# Install frontend dependencies
cd ../frontend
npm install tailwind css 
start npm run dev
# Start backend server
cd backend
npm start

# In a separate terminal, start frontend
cd ../frontend
npm start


API Endpoints
Authentication
POST /api/v1/user/register - User registration

POST /api/v1/user/login - User login

GET /api/v1/user/logout - User logout

GET /api/v1/user/is-auth - Get current user profile

POST /api/v1/user/verify-otp - User verify otp

POST /api/v1/user/resend-otp - User resend otp

Products
GET /api/v1/products/list - Get all products

GET /api/v1/products/add - add product 

PUT /api/products/:id - Update product

DELETE /api/products/stock - product in the stock

Orders
POST /api/v1/order/cod - cash on delevirey

GET /api/v1/order/user - Get user order

GET /api/v1/order/seller - check seller order

POST /api/v1/order/rezer - for payment

address

POST /api/v1/address/add- Add address

GET /api/v1/address/get- get address

card 

POST /api/v1/card/update- for update card

Seller

POST /api/v1/seller/login- for login seller

GET /api/v1/seller/is-auth- for authenticate 

GET /api/v1/seller/logout -for logout 

Deployment

backend -  https://quick-kart-navj.onrender.com

frontend-  quick-kart-two.vercel.app



project link--   quick-kart-two.vercel.app

git hub project link--  https://github.com/adarshaady17/Quick-Kart