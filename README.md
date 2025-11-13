# EDM-Website - E-Commerce Platform

A full-stack e-commerce platform with product management, shopping cart functionality, admin dashboard, and analytics. Built with React and Node.js for a modern, responsive user experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)

## 🎯 Overview

EDM-Website is a comprehensive e-commerce solution designed for seamless shopping experiences and efficient admin management. It features a consumer-facing frontend with product discovery, cart management, and checkout capabilities, along with a powerful admin dashboard for product management, analytics, and customer engagement.

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing** - Explore products by category with search and filtering
- **Product Details** - Comprehensive product information, images, and specifications
- **Shopping Cart** - Add/remove items, manage quantities, persistent cart
- **Checkout** - Secure checkout process
- **User Accounts** - Register and login for personalized experience
- **Reviews & Ratings** - Leave and view product reviews with ratings
- **Contact Form** - Submit inquiries and feedback
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile-friendly interface

### 🧑‍💼 Admin Features
- **Product Management** - Create, edit, and delete products
- **Category Management** - Organize products by categories
- **Banner Management** - Create and manage promotional banners
- **Analytics Dashboard** - Comprehensive statistics and insights:
  - Total products, users, and reviews
  - Daily visitor tracking
  - Popular products analytics
  - Average product ratings
  - Recent activities log
- **Review Management** - Monitor and manage customer reviews
- **Contact Information** - View and update site contact details
- **Admin Authentication** - Secure login for administrators

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - UI library
- **React Router** (v7.9.4) - Client-side routing
- **Axios** (v1.12.2) - HTTP client
- **React Helmet Async** (v2.0.5) - SEO management
- **Recharts** (v3.3.0) - Analytics charts
- **React Slick** (v0.31.0) - Carousel component
- **React Toastify** (v11.0.5) - Notifications
- **Swiper** (v12.0.3) - Image slider
- **React Icons** (v5.5.0) - Icon library

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Image hosting and management
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Dotenv** - Environment configuration

## 📁 Project Structure

```
EDM-Website/
├── backend/                    # Node.js Express server
│   ├── config/                # Database configuration
│   ├── controllers/           # Business logic
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── middlewares/          # Custom middleware
│   ├── utils/                # Helper utilities
│   ├── server.js             # Express app entry point
│   └── package.json
├── src/                        # React frontend
│   ├── components/           # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   └── user/        # Public pages
│   │   └── common/          # Common components
│   ├── context/             # React context (Theme, Categories)
│   ├── routes/              # Route configurations
│   ├── styles/              # CSS files
│   ├── api/                 # API service calls
│   ├── assets/              # Images and static files
│   ├── App.js              # Main app component
│   └── index.js            # React entry point
├── public/                   # Static files
├── package.json             # Frontend dependencies
└── README.md               # This file
```

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/) for image hosting

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Asad-Zaidi/EDM-Website.git
cd EDM-Website
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/edm-website
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edm-website

# Port
PORT=5000

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# JWT (if using authentication)
JWT_SECRET=your_jwt_secret_key
```

### Frontend Environment Variables

Create a `.env` file in the `src/` directory (if needed):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Option 1: Development Mode (Separate Terminals)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
npm start
# Frontend runs on http://localhost:3000
```

### Option 2: Production Build

**Build Frontend:**
```bash
npm run build
```

**Deploy Backend:**
```bash
cd backend
node server.js
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes
- `POST /auth/register` - Register admin user
- `POST /auth/login` - Admin login

### Product Routes
- `GET /products` - Get all products
- `GET /products/popular` - Get popular products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Category Routes
- `GET /categories` - Get all categories
- `POST /categories` - Create category (Admin)

### Review Routes
- `POST /reviews` - Add product review
- `GET /reviews/:productId` - Get product reviews
- `GET /reviews/admin/stats` - Review statistics (Admin)

### Banner Routes
- `GET /banners/active` - Get active banners
- `POST /banners` - Create banner (Admin)
- `DELETE /banners/:id` - Delete banner (Admin)

### Admin Routes
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/daily-visits` - Daily visitor analytics

### Contact Routes
- `GET /contact` - Get contact information
- `PUT /contact` - Update contact (Admin)
- `POST /messages` - Submit contact form

For detailed API documentation, see [API.txt](./API.txt)

## 💡 Usage Guide

### For Customers

1. **Browse Products** - Visit the home page and explore products
2. **View Details** - Click on a product to see full details and reviews
3. **Add to Cart** - Add items to your shopping cart
4. **Checkout** - Proceed to checkout to complete purchase
5. **Leave Review** - After purchase, leave a review and rating
6. **Contact** - Use contact form to submit inquiries

### For Administrators

1. **Login** - Navigate to `/admin/login`
2. **Dashboard** - View analytics and recent activities
3. **Manage Products** - Add, edit, or delete products
4. **Manage Categories** - Organize product categories
5. **Manage Banners** - Create promotional banners
6. **View Reviews** - Monitor customer reviews
7. **Check Contact Messages** - View customer inquiries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic assignment. 

## 📞 Support

For support, please open an issue in the repository or contact the project maintainers.

---

**Made with ❤️ by the EDM-Website Team**
