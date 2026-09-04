Zenfinith is a production-ready, full-stack e-commerce application that combines a modern Next.js frontend with a Django-powered backend for intelligent product recommendations. It is designed to be secure, scalable, and feature-rich.

Core Features
Authentication – Email/password, OAuth (Google/GitHub), two-factor authentication (2FA), session management with device fingerprinting.

Product Catalog – Dynamic collections, search, filtering, sorting, multi-currency support.

Cart & Wishlist – Add, remove, update quantities, clear cart, save items.

Checkout & Payments – Stripe integration, discount coupons, order creation, manual payment verification.

Admin Dashboard – Manage products, coupons, and orders with a sleek UI.

Recommendations – Content-based product recommendations via Django REST endpoints.

Active Devices – View and revoke login sessions per device.

Email Notifications – Login alerts, order confirmations via Nodemailer.

Responsive UI – Built with Tailwind CSS and a custom design system.

Tech Stack
Frontend: Next.js, TypeScript, Tailwind CSS, React Redux, React Hook Form

Backend: Next.js API Routes (Node.js), Django (Python) for recommendations

Database: PostgreSQL (Neon) with Prisma ORM, Django ORM

Authentication: NextAuth, custom JWT, bcrypt, fingerprinting

Payments: Stripe Checkout

File Storage: Cloudinary

Email: Nodemailer

Architecture
The frontend and backend are loosely coupled. The main application logic runs on Next.js API routes, while the Django service provides a recommendation engine. Both services share the same PostgreSQL database. This hybrid approach demonstrates how to integrate a Python microservice into a JavaScript/TypeScript project.

