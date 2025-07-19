# **Guest House Management System - Backend**

## Overview

This backend system provides a comprehensive API for managing guest house operations, including room bookings, user management, payment processing, and administrative functions. Built with Node.js, Express, and Prisma, it follows best practices for a scalable and maintainable codebase.

## Features

### User Management

- User registration and authentication
- Role-based access control (guests, administrators)
- JWT-based authentication
- Profile management

### Room Management

- Room inventory with detailed information (capacity, pricing, availability)
- Room status tracking (available, maintenance, etc.)
- Room category and type organization

### Booking System

- Real-time availability checking
- Room reservation and booking management
- Support for different guest capacities
- Check-in/check-out date validation
- Booking confirmation and modification
- Booking history for users and administrators

### Payment Processing

- Secure payment handling via Stripe integration
- Multiple payment methods support
- Discount management
- Payment status tracking
- Payment receipts and invoices
- Transaction history

### Admin Dashboard

- Comprehensive analytics and reporting
- Booking overview and management
- User management tools
- Payment tracking and reconciliation

### Notifications

- Email notifications for bookings and payments
- Confirmation emails
- Reminder notifications

### Issue Management

- Guest issue reporting system
- Issue tracking and resolution workflow

## Technology Stack

- **Framework**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: Stripe
- **Email**: Nodemailer with React Email templates
- **Validation**: Zod schema validation
- **Logging**: Winston
- **Testing**: Jest

## Project Structure

- **root directory**
  - **docker/** - Docker configuration for containerized deployment
  - **docs/** - Project documentation and API references
  - **logs/** - Application logs (auto-generated)
  - **prisma/** - Database schema and migrations
  - **scripts/** - Utility scripts for development and deployment
  - **src/** - Core application source code
    - **domains/** - Feature modules (users, bookings, rooms, etc.)
    - **libraries/** - Shared utilities and helpers
  - **test/** - Unit and integration tests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Stripe account for payment processing

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shihabsararrafid/Guest-House-Backend.git
   cd Guest-House-Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Create a `.env.development` file in the src directory based on `.env.example`
   - Configure database connection, JWT secrets, and Stripe API keys

4. Generate JWT keypair:

   ```bash
   npm run genKey
   ```

5. Set up the database:
   ```bash
   npm run generate     # Generate Prisma client
   npm run migrate-dev  # Run database migrations
   ```

### Development

Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:3000` (or the port specified in your environment).

### Building for Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Documentation

API documentation can be found in the `/docs/api-documentation.md` file or by visiting the `/api-docs` endpoint when the server is running.

The documentation includes detailed information about:

- Authentication endpoints
- User management
- Room operations
- Booking processes
- Payment handling
- Issue management
- Admin dashboard

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

Shihab Sarar Islam Rafid
