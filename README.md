# 🚗 Vehicle Rental System

A backend API for managing vehicle rentals with authentication, role-based access control, and booking management.

## 🛠️ Tech Stack

Node.js | TypeScript | Express.js | PostgreSQL | JWT | bcrypt

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup .env file
admin
{
    "email": "Asraf1@gmail.com",
    "password":"123456"
}

git repo : https://github.com/GreenerAsraf/assignment2L2b6

PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental

CONNECTION_STRING="postgresql://neondb_owner:npg_CKI7UErePG4k@ep-silent-morning-a44uuzlx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

JWT_SECRET="KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
JWT_EXPIRES_IN=7d


# http://localhost:5000/api/v1/vehicles all vehicles
# http://localhost:5000/api/v1/vehicles/:id single vehicle by id

# localhost:5000/api/v1/users/ all users (GET)
# localhost:5000/api/v1/users/:id single user by id (GET)
# localhost:5000/api/v1/users/ create user (POST)
# localhost:5000/api/v1/users/:id update user (PUT)


# localhost:5000/api/v1/vehicles/3 update vehicle (PUT) name daily_rent_price availability_status
# localhost:5000/api/v1/vehicles/ create vehicle (POST) name daily_rent_price availability_status
# localhost:5000/api/v1/vehicles/:id delete vehicle (DELETE)

# Run application
npm run dev
```

## 📊 Database Schema

**Users**: id, name, email, password, phone, role (admin/customer)

**Vehicles**: id, vehicle_name, type (car/bike/van/SUV), registration_number, daily_rent_price, availability_status

**Bookings**: id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status (active/cancelled/returned)

## 🌐 API Endpoints

**Base URL**: `/api/v1`

### Authentication (Public)

- `POST /auth/signup` - Register user
- `POST /auth/signin` - Login & get JWT token

### Vehicles

- `POST /vehicles` - Add vehicle (Admin)
- `GET /vehicles` - List all vehicles (Public)
- `GET /vehicles/:vehicleId` - Get vehicle details (Public)
- `PUT /vehicles/:vehicleId` - Update vehicle (Admin)
- `DELETE /vehicles/:vehicleId` - Delete vehicle (Admin)

### Users

- `GET /users` - List all users (Admin)
- `PUT /users/:userId` - Update user (Admin/Own)
- `DELETE /users/:userId` - Delete user (Admin)

### Bookings

- `POST /bookings` - Create booking (Customer/Admin)
- `GET /bookings` - List bookings (Role-based)
- `PUT /bookings/:bookingId` - Update booking (Role-based)

## 🔐 Authentication

Protected routes require: `Authorization: Bearer <token>`

**Roles**: Admin (full access) | Customer (own bookings only)

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── vehicles/
│   ├── users/
│   └── bookings/
├── middleware/
├── config/
└── app.ts
```

## 📝 Example Usage

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"secure123","phone":"+1234567890"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure123"}'
```

# assignment2L2b6
