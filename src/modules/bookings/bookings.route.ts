import { Router } from 'express'
import auth from '../../middleware/auth'
import { bookingsController } from './bookings.controller'
import { Roles } from '../auth/auth.constant'

const router = Router()

// Create booking (Customer only)
router.post('/', auth(Roles.customer), bookingsController.createBooking)

// List bookings (Admin → all, Customer → own)
router.get(
  '/',
  auth(Roles.customer || Roles.admin),
  bookingsController.listBookings
)

router.put(
  '/:bookingId',
  auth(Roles.customer),
  bookingsController.updateBooking
)

export const BookingRoute = router
