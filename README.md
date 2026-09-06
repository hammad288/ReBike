# 🏍️ ReBike — Pre-Owned & New Bike Marketplace

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![React](https://img.shields.io/badge/React-v18.2-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-brightgreen.svg)
![Express](https://img.shields.io/badge/Express-v5.2-lightgrey.svg)
![License](https://img.shields.io/badge/License-ISC-orange.svg)

**ReBike** is a full-stack e-commerce web platform designed for buying, selling, and verifying pre-owned and new two-wheelers. Built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js), ReBike offers role-based access for Buyers, Sellers, and Administrators, featuring 360° interactive bike views, secure Braintree payment integration, document verification for vehicle safety, and brand-based filtering.

---

## ✨ Features

### 👤 Buyer / User Features
- **Browse & Filter**: Filter bikes by brand, price range, and condition with single-select controls.
- **360° Interactive View**: Experience 360° turntable bike image viewing for supported models.
- **Multi-Image Gallery**: View detailed high-resolution images (3 to 5 images per listing).
- **Shopping Cart**: Dynamic cart management with instant quantity adjustment and total calculation.
- **Secure Payment Gateway**: Checkout powered by **Braintree** (Credit/Debit cards, Drop-in UI).
- **Order Tracking**: Order confirmation page with real-time status updates.

### 🏷️ Seller Features
- **Seller Dashboard**: Manage listed bikes and track listing status (Pending, Approved, Rejected).
- **Add & Edit Listings**: Upload bike details including Brand, Model, Year, Mileage, Engine CC, Price, and multiple images.
- **Vehicle Verification**: Submit official vehicle documents (RC, Government ID, Insurance) for verified seller badge.

### 🛡️ Admin Features
- **Admin Dashboard**: Overview of system statistics (Users, Bikes, Orders, Verifications).
- **Listing Approval**: Review, approve, or reject seller bike listings with custom rejection reasons.
- **Verification Management**: Inspect seller verification documents and grant verified status.
- **Order Management**: Monitor transactions, view payment IDs, and manage shipping/delivery status.
- **User & Brand Management**: Manage registered user accounts, assign admin roles, and create/update bike brands.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Ant Design (AntD), Bootstrap 5, Braintree Web Drop-in |
| **Styling & UI** | Vanilla CSS, React Icons, React Hot Toast / Toastify, React Image Turntable |
| **Form Handling** | Formik, Yup Validation Schema |
| **Backend** | Node.js, Express 5, JWT (JSON Web Tokens), Bcryptjs |
| **Database** | MongoDB & Mongoose 9 (Atlas Cloud / Local MongoDB) |
| **Payment Gateway** | Braintree Payment Gateway (PayPal/Braintree Drop-in SDK) |
| **Integrations** | Fast2SMS API (SMS/OTP Services), Multer (Image handling) |

---

## 📂 Project Structure

```text
ReBike/
├── backend/
│   ├── middleware/        # Authentication & Role Authorization Middlewares
│   ├── models/            # Mongoose Models (Bike, User, Order, Brand, Verification)
│   ├── routes/            # Express API Routes
│   │   ├── authRouters.js       # Auth & JWT management
│   │   ├── bikeRouters.js       # Bike catalog CRUD & filters
│   │   ├── brandRouters.js      # Brand management
│   │   ├── braintreeRoutes.js   # Braintree token & transaction routes
│   │   ├── orderRoutes.js       # Order creation & tracking
│   │   ├── sellerRoutes.js      # Seller listing management
│   │   ├── userRoutes.js        # User profile & admin management
│   │   └── verificationRoutes.js# Vehicle RC & document verification
│   ├── .env               # Environment configuration
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express app entry point
│
└── frontend/
    ├── public/            # Public assets & index.html
    ├── src/
    │   ├── admin/         # Admin Management Components (Bikes, Users, Orders, Verifications)
    │   ├── seller/        # Seller Dashboard & Vehicle Verification Components
    │   ├── pages/         # User Pages (Home, BikeView, Cart, Login, Register, OrderConfirmation)
    │   ├── context/       # React Context (Auth, Cart state)
    │   ├── services/      # API Call Service Wrappers
    │   ├── App.js         # React App & Router configuration
    │   └── index.js       # React DOM Entry point
    └── package.json       # Frontend dependencies
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher)
- **MongoDB** (Local instance or [MongoDB Atlas Cloud](https://cloud.mongodb.com))

---

### 📥 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hammad288/ReBike.git
   cd ReBike
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/rebike?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   
   # Braintree Payment Gateway Credentials
   BRAINTREE_MERCHANT_ID=your_merchant_id
   BRAINTREE_PUBLIC_KEY=your_public_key
   BRAINTREE_PRIVATE_KEY=your_private_key
   
   # Fast2SMS API Key (Optional for SMS/OTP)
   FAST2SMS_API_KEY=your_fast2sms_api_key
   ```

4. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

---

## 💻 Running the Application

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

2. **Start the Frontend Client**:
   ```bash
   cd frontend
   npm start
   ```
   The frontend application will open at `http://localhost:3000`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user/seller | Public |
| `POST` | `/api/auth/login` | Login user & return JWT Token | Public |
| `GET` | `/api/bikes` | Fetch approved bike listings | Public |
| `GET` | `/api/bikes/:id` | Get single bike details | Public |
| `POST` | `/api/seller/add-bike` | Create a new bike listing | Seller |
| `GET` | `/api/seller/my-bikes` | Get seller's submitted bikes | Seller |
| `POST` | `/api/verification/submit` | Submit RC/Govt ID verification | Seller |
| `GET` | `/api/braintree/token` | Generate Braintree client token | Auth User |
| `POST` | `/api/braintree/payment` | Process checkout transaction | Auth User |
| `GET` | `/api/user/all-users` | Fetch all registered users | Admin |
| `PUT` | `/api/bikes/approve/:id` | Approve/Reject bike listing | Admin |

---

## 🔒 License
This project is licensed under the **ISC License**.

---

## 👤 Author
Developed by **[Hammad](https://github.com/hammad288)**
.
