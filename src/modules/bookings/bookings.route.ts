import { Router } from 'express'
import auth from '../../middleware/auth'
import { bookingsController } from './bookings.controller'
import { Roles } from '../auth/auth.constant'

const router = Router()

// Create booking (Customer or Admin)
router.post('/', auth(Roles.customer, Roles.admin), bookingsController.createBooking)

// List bookings (Admin → all, Customer → own)
router.get(
  '/',
  auth(Roles.customer, Roles.admin),
  bookingsController.listBookings
)

// Update booking (Customer to cancel, Admin to return)
router.put(
  '/:bookingId',
  auth(Roles.customer, Roles.admin),
  bookingsController.updateBooking
)

export const BookingRoute = router
