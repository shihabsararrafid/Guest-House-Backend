# Guest House Management System API Documentation

This document provides detailed information about the API endpoints available in the Guest House Management System.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

All endpoints return standardized error responses in the following format:

```json
{
  "status": "error",
  "errorCode": "error-type",
  "message": "Description of the error",
  "statusCode": 4xx/5xx
}
```

Common error codes:

- `validation-error`: Request data validation failed
- `authentication-error`: Authentication issues
- `authorization-error`: Permission issues
- `not-found`: Resource not found
- `database-error`: Database operation errors

## API Endpoints

### Authentication

#### Register User

```
POST /auth/register
```

Register a new user account.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "GUEST" // GUEST or ADMIN
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "GUEST",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Login

```
POST /auth/login
```

Authenticate a user and receive a JWT token.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "GUEST"
    }
  }
}
```

---

### User Management

#### Get User Profile

```
GET /users/profile
```

Get the profile of the authenticated user.

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "GUEST",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Update User Profile

```
PUT /users/profile
```

Update the profile of the authenticated user.

**Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phoneNumber": "+1234567890",
    "role": "GUEST",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Get All Users (Admin only)

```
GET /users
```

Get a list of all users.

**Query Parameters**:

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 10)
- `role` (optional): Filter by user role (GUEST or ADMIN)
- `search` (optional): Search by name or email

**Response**:

```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "user-id-1",
        "email": "user1@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "GUEST"
      },
      {
        "id": "user-id-2",
        "email": "user2@example.com",
        "firstName": "Jane",
        "lastName": "Smith",
        "role": "GUEST"
      }
    ],
    "pagination": {
      "total": 50,
      "pages": 5,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

---

### Room Management

#### Get All Rooms

```
GET /rooms
```

Get a list of all available rooms.

**Query Parameters**:

- `type` (optional): Filter by room type
- `minCapacity` (optional): Minimum capacity
- `maxCapacity` (optional): Maximum capacity
- `minPrice` (optional): Minimum price per night
- `maxPrice` (optional): Maximum price per night

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "room-id-1",
      "roomNumber": "101",
      "type": "STANDARD",
      "capacity": 2,
      "pricePerNight": 99.99,
      "description": "Comfortable standard room with two single beds",
      "status": "AVAILABLE",
      "amenities": ["TV", "Air Conditioning", "Wi-Fi"]
    },
    {
      "id": "room-id-2",
      "roomNumber": "102",
      "type": "DELUXE",
      "capacity": 4,
      "pricePerNight": 149.99,
      "description": "Spacious deluxe room with a queen bed and sofa bed",
      "status": "AVAILABLE",
      "amenities": ["TV", "Air Conditioning", "Wi-Fi", "Mini Bar", "Balcony"]
    }
  ]
}
```

#### Get Room Details

```
GET /rooms/:id
```

Get detailed information about a specific room.

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "room-id-1",
    "roomNumber": "101",
    "type": "STANDARD",
    "capacity": 2,
    "pricePerNight": 99.99,
    "description": "Comfortable standard room with two single beds",
    "status": "AVAILABLE",
    "amenities": ["TV", "Air Conditioning", "Wi-Fi"],
    "beds": [
      {
        "id": "bed-id-1",
        "type": "SINGLE",
        "count": 2
      }
    ],
    "images": [
      {
        "url": "https://example.com/room-101-1.jpg",
        "caption": "Room overview"
      },
      {
        "url": "https://example.com/room-101-2.jpg",
        "caption": "Bathroom"
      }
    ]
  }
}
```

#### Create Room (Admin only)

```
POST /rooms
```

Create a new room.

**Request Body**:

```json
{
  "roomNumber": "103",
  "type": "DELUXE",
  "capacity": 3,
  "pricePerNight": 129.99,
  "description": "Deluxe room with balcony and city view",
  "amenities": ["TV", "Air Conditioning", "Wi-Fi", "Mini Bar"],
  "beds": [
    {
      "type": "QUEEN",
      "count": 1
    },
    {
      "type": "SINGLE",
      "count": 1
    }
  ]
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "room-id-3",
    "roomNumber": "103",
    "type": "DELUXE",
    "capacity": 3,
    "pricePerNight": 129.99,
    "description": "Deluxe room with balcony and city view",
    "status": "AVAILABLE",
    "amenities": ["TV", "Air Conditioning", "Wi-Fi", "Mini Bar"],
    "beds": [
      {
        "id": "bed-id-3",
        "type": "QUEEN",
        "count": 1
      },
      {
        "id": "bed-id-4",
        "type": "SINGLE",
        "count": 1
      }
    ],
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Update Room (Admin only)

```
PUT /rooms/:id
```

Update an existing room.

**Request Body**:

```json
{
  "status": "MAINTENANCE",
  "pricePerNight": 139.99,
  "description": "Updated room description"
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "room-id-3",
    "roomNumber": "103",
    "type": "DELUXE",
    "capacity": 3,
    "pricePerNight": 139.99,
    "description": "Updated room description",
    "status": "MAINTENANCE",
    "amenities": ["TV", "Air Conditioning", "Wi-Fi", "Mini Bar"],
    "updatedAt": "2023-01-02T00:00:00Z"
  }
}
```

#### Delete Room (Admin only)

```
DELETE /rooms/:id
```

Delete a room.

**Response**:

```json
{
  "status": "success",
  "data": {
    "message": "Room deleted successfully"
  }
}
```

---

### Booking Management

#### Check Room Availability

```
GET /bookings/availability
```

Check which rooms are available for specific dates and capacity.

**Query Parameters**:

- `checkIn`: Check-in date (YYYY-MM-DD)
- `checkOut`: Check-out date (YYYY-MM-DD)
- `capacity`: JSON array of capacities needed [1, 2, 4]

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "room-id-1",
      "roomNumber": "101",
      "type": "STANDARD",
      "capacity": 2,
      "pricePerNight": 99.99,
      "description": "Comfortable standard room with two single beds",
      "status": "AVAILABLE",
      "amenities": ["TV", "Air Conditioning", "Wi-Fi"]
    },
    {
      "id": "room-id-3",
      "roomNumber": "103",
      "type": "DELUXE",
      "capacity": 3,
      "pricePerNight": 139.99,
      "description": "Deluxe room with balcony and city view",
      "status": "AVAILABLE",
      "amenities": ["TV", "Air Conditioning", "Wi-Fi", "Mini Bar"]
    }
  ]
}
```

#### Create Booking

```
POST /bookings
```

Create a new booking for one or multiple rooms.

**Request Body**:

```json
{
  "checkIn": "2023-07-15",
  "checkOut": "2023-07-20",
  "rooms": [
    {
      "id": "room-id-1",
      "numberOfGuests": 2,
      "pricePerNight": 99.99
    },
    {
      "id": "room-id-3",
      "numberOfGuests": 3,
      "pricePerNight": 139.99
    }
  ],
  "specialRequests": "We'll arrive late around 10pm",
  "discount": 50,
  "discountType": "Amount"
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "booking-id-1",
    "checkIn": "2023-07-15T12:00:00Z",
    "checkOut": "2023-07-20T11:00:00Z",
    "totalPrice": 1199.9,
    "totalPriceWithDiscount": 1149.9,
    "discount": 50,
    "discountType": "Amount",
    "status": "CONFIRMED",
    "isPaid": false,
    "specialRequests": "We'll arrive late around 10pm",
    "guestId": "user-id-1",
    "rooms": [
      {
        "id": "booking-room-id-1",
        "roomId": "room-id-1",
        "numberOfGuests": 2,
        "pricePerNight": 99.99,
        "room": {
          "roomNumber": "101"
        }
      },
      {
        "id": "booking-room-id-2",
        "roomId": "room-id-3",
        "numberOfGuests": 3,
        "pricePerNight": 139.99,
        "room": {
          "roomNumber": "103"
        }
      }
    ],
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Get User Bookings

```
GET /bookings/user
```

Get all bookings for the authenticated user.

**Query Parameters**:

- `checkIn` (optional): Filter by check-in date
- `checkOut` (optional): Filter by check-out date
- `isPaid` (optional): Filter by payment status
- `bookingStatus` (optional): Filter by booking status
- `roomId` (optional): Filter by specific room

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "booking-id-1",
      "checkIn": "2023-07-15T12:00:00Z",
      "checkOut": "2023-07-20T11:00:00Z",
      "totalPrice": 1199.9,
      "totalPriceWithDiscount": 1149.9,
      "status": "CONFIRMED",
      "isPaid": false,
      "rooms": [
        {
          "id": "booking-room-id-1",
          "numberOfGuests": 2,
          "room": {
            "roomNumber": "101"
          }
        },
        {
          "id": "booking-room-id-2",
          "numberOfGuests": 3,
          "room": {
            "roomNumber": "103"
          }
        }
      ]
    }
  ]
}
```

#### Get All Bookings (Admin only)

```
GET /bookings/admin
```

Get all bookings in the system.

**Query Parameters**:

- `checkIn` (optional): Filter by check-in date
- `checkOut` (optional): Filter by check-out date
- `isPaid` (optional): Filter by payment status
- `bookingStatus` (optional): Filter by booking status
- `guestId` (optional): Filter by specific guest
- `roomId` (optional): Filter by specific room

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "booking-id-1",
      "checkIn": "2023-07-15T12:00:00Z",
      "checkOut": "2023-07-20T11:00:00Z",
      "totalPrice": 1199.9,
      "totalPriceWithDiscount": 1149.9,
      "discount": 50,
      "discountType": "Amount",
      "status": "CONFIRMED",
      "isPaid": false,
      "specialRequests": "We'll arrive late around 10pm",
      "guestId": "user-id-1",
      "rooms": [
        {
          "id": "booking-room-id-1",
          "roomId": "room-id-1",
          "numberOfGuests": 2,
          "room": {
            "roomNumber": "101"
          }
        },
        {
          "id": "booking-room-id-2",
          "roomId": "room-id-3",
          "numberOfGuests": 3,
          "room": {
            "roomNumber": "103"
          }
        }
      ],
      "transaction": {
        "id": "transaction-id-1",
        "status": "PENDING"
      }
    }
  ]
}
```

#### Get Booking Details

```
GET /bookings/:id
```

Get detailed information about a specific booking.

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "booking-id-1",
    "checkIn": "2023-07-15T12:00:00Z",
    "checkOut": "2023-07-20T11:00:00Z",
    "totalPrice": 1199.9,
    "totalPriceWithDiscount": 1149.9,
    "discount": 50,
    "discountType": "Amount",
    "status": "CONFIRMED",
    "isPaid": false,
    "specialRequests": "We'll arrive late around 10pm",
    "guestId": "user-id-1",
    "rooms": [
      {
        "id": "booking-room-id-1",
        "roomId": "room-id-1",
        "numberOfGuests": 2,
        "pricePerNight": 99.99,
        "room": {
          "id": "room-id-1",
          "roomNumber": "101",
          "type": "STANDARD"
        }
      },
      {
        "id": "booking-room-id-2",
        "roomId": "room-id-3",
        "numberOfGuests": 3,
        "pricePerNight": 139.99,
        "room": {
          "id": "room-id-3",
          "roomNumber": "103",
          "type": "DELUXE"
        }
      }
    ]
  }
}
```

#### Delete Booking

```
DELETE /bookings/:id
```

Cancel and delete a booking.

**Response**:

```json
{
  "status": "success",
  "data": {
    "message": "Booking cancelled successfully"
  }
}
```

---

### Payment Management

#### Create Payment

```
POST /payments/booking/:bookingId
```

Create a payment for a booking.

**Request Body**:

```json
{
  "paymentMethod": "CREDIT_CARD",
  "cardDetails": {
    "number": "4242424242424242",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "cvc": "123"
  }
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "payment-id-1",
    "bookingId": "booking-id-1",
    "amount": 1149.9,
    "paymentMethod": "CREDIT_CARD",
    "status": "PENDING",
    "stripePaymentIntentId": "pi_123456789",
    "stripeClientSecret": "pi_123456789_secret_7890",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Confirm Payment

```
POST /payments/confirm/:paymentId
```

Confirm a payment after client-side processing.

**Request Body**:

```json
{
  "paymentIntentId": "pi_123456789"
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "payment-id-1",
    "bookingId": "booking-id-1",
    "amount": 1149.9,
    "paymentMethod": "CREDIT_CARD",
    "status": "COMPLETED",
    "stripePaymentIntentId": "pi_123456789",
    "updatedAt": "2023-01-01T00:10:00Z"
  }
}
```

#### Get Payment History (User)

```
GET /payments/history
```

Get payment history for the authenticated user.

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "payment-id-1",
      "bookingId": "booking-id-1",
      "amount": 1149.9,
      "paymentMethod": "CREDIT_CARD",
      "status": "COMPLETED",
      "createdAt": "2023-01-01T00:00:00Z",
      "booking": {
        "checkIn": "2023-07-15T12:00:00Z",
        "checkOut": "2023-07-20T11:00:00Z"
      }
    }
  ]
}
```

---

### Issue Management

#### Report Issue

```
POST /issues
```

Report an issue related to a booking or room.

**Request Body**:

```json
{
  "bookingId": "booking-id-1",
  "roomId": "room-id-1",
  "category": "MAINTENANCE",
  "title": "Broken air conditioner",
  "description": "The air conditioner in room 101 is not cooling properly."
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "issue-id-1",
    "bookingId": "booking-id-1",
    "roomId": "room-id-1",
    "guestId": "user-id-1",
    "category": "MAINTENANCE",
    "title": "Broken air conditioner",
    "description": "The air conditioner in room 101 is not cooling properly.",
    "status": "OPEN",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
```

#### Get User Issues

```
GET /issues/user
```

Get all issues reported by the authenticated user.

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "issue-id-1",
      "bookingId": "booking-id-1",
      "roomId": "room-id-1",
      "category": "MAINTENANCE",
      "title": "Broken air conditioner",
      "description": "The air conditioner in room 101 is not cooling properly.",
      "status": "OPEN",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### Get All Issues (Admin only)

```
GET /issues
```

Get all reported issues.

**Query Parameters**:

- `status` (optional): Filter by issue status (OPEN, IN_PROGRESS, RESOLVED)
- `category` (optional): Filter by issue category
- `bookingId` (optional): Filter by booking
- `roomId` (optional): Filter by room

**Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": "issue-id-1",
      "bookingId": "booking-id-1",
      "roomId": "room-id-1",
      "guestId": "user-id-1",
      "category": "MAINTENANCE",
      "title": "Broken air conditioner",
      "description": "The air conditioner in room 101 is not cooling properly.",
      "status": "OPEN",
      "createdAt": "2023-01-01T00:00:00Z",
      "guest": {
        "id": "user-id-1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
      }
    }
  ]
}
```

#### Update Issue Status (Admin only)

```
PUT /issues/:id
```

Update the status of an issue.

**Request Body**:

```json
{
  "status": "IN_PROGRESS",
  "adminNotes": "Technician scheduled for tomorrow morning"
}
```

**Response**:

```json
{
  "status": "success",
  "data": {
    "id": "issue-id-1",
    "bookingId": "booking-id-1",
    "roomId": "room-id-1",
    "guestId": "user-id-1",
    "category": "MAINTENANCE",
    "title": "Broken air conditioner",
    "description": "The air conditioner in room 101 is not cooling properly.",
    "status": "IN_PROGRESS",
    "adminNotes": "Technician scheduled for tomorrow morning",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
}
```

---

### Dashboard (Admin only)

#### Get Dashboard Data

```
GET /dashboard
```

Get summary data for the admin dashboard.

**Response**:

```json
{
  "status": "success",
  "data": {
    "totalBookings": {
      "today": 5,
      "thisWeek": 23,
      "thisMonth": 86,
      "total": 542
    },
    "occupancyRate": {
      "today": 65,
      "thisWeek": 72,
      "thisMonth": 68
    },
    "revenue": {
      "today": 1250.5,
      "thisWeek": 7890.25,
      "thisMonth": 32450.75,
      "total": 245680.5
    },
    "upcomingCheckIns": 8,
    "upcomingCheckOuts": 6,
    "pendingIssues": 4,
    "availableRooms": 12,
    "roomTypeDistribution": [
      {
        "type": "STANDARD",
        "count": 8,
        "occupiedCount": 5
      },
      {
        "type": "DELUXE",
        "count": 6,
        "occupiedCount": 3
      },
      {
        "type": "SUITE",
        "count": 4,
        "occupiedCount": 2
      }
    ]
  }
}
```
