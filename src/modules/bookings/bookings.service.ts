import { pool } from '../../database/db'

const createBookingIntoDB = async (payload: {
  customer_id: number
  vehicle_id: number
  rent_start_date: string
  rent_end_date: string
}) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload

  const start = new Date(rent_start_date)
  const end = new Date(rent_end_date)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid start or end date format!')
  }

  if (end.getTime() <= start.getTime()) {
    throw new Error('Rent end date must be after start date!')
  }

  // Use a transaction to ensure database consistency
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 1. Get vehicle details and check availability
    const vehicleRes = await client.query(
      `SELECT * FROM vehicles WHERE id = $1 FOR UPDATE`,
      [vehicle_id]
    )

    if (vehicleRes.rows.length === 0) {
      throw new Error('Vehicle not found!')
    }

    const vehicle = vehicleRes.rows[0]
    if (vehicle.availability_status !== 'available') {
      throw new Error('Vehicle is not available for booking!')
    }

    // 2. Calculate duration in days (minimum 1 day)
    const durationMs = end.getTime() - start.getTime()
    const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)))
    const totalPrice = Number(vehicle.daily_rent_price) * durationDays

    // 3. Update vehicle status to booked
    await client.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
    )

    // 4. Create the booking
    const bookingRes = await client.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [customer_id, vehicle_id, start, end, totalPrice]
    )

    await client.query('COMMIT')
    return bookingRes.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getAllBookingsIntoDB = async (userId: number, role: string) => {
  if (role === 'admin') {
    const result = await pool.query(`SELECT * FROM bookings`)
    return result
  } else {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id = $1`,
      [userId]
    )
    return result
  }
}

const cancelBookingIntoDB = async (bookingId: string, customerId: number) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Get booking details
    const bookingRes = await client.query(
      `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
      [bookingId]
    )

    if (bookingRes.rows.length === 0) {
      throw new Error('Booking not found!')
    }

    const booking = bookingRes.rows[0]

    if (Number(booking.customer_id) !== customerId) {
      throw new Error('Forbidden! You can only cancel your own bookings.')
    }

    if (booking.status !== 'active') {
      throw new Error(`Cannot cancel a booking that is already ${booking.status}!`)
    }

    // Check if start date has already passed
    if (new Date().getTime() >= new Date(booking.rent_start_date).getTime()) {
      throw new Error('Cannot cancel booking after the rental start date!')
    }

    // Update booking status
    const updatedBookingRes = await client.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [bookingId]
    )

    // Update vehicle back to available
    await client.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    )

    await client.query('COMMIT')
    return updatedBookingRes.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const returnVehicleIntoDB = async (bookingId: string) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Get booking details
    const bookingRes = await client.query(
      `SELECT * FROM bookings WHERE id = $1 FOR UPDATE`,
      [bookingId]
    )

    if (bookingRes.rows.length === 0) {
      throw new Error('Booking not found!')
    }

    const booking = bookingRes.rows[0]

    if (booking.status !== 'active') {
      throw new Error(`Cannot return vehicle for a booking with status ${booking.status}!`)
    }

    // Update booking status to returned
    const updatedBookingRes = await client.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    )

    // Update vehicle availability back to available
    await client.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    )

    await client.query('COMMIT')
    return updatedBookingRes.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const autoReturnExpiredBookings = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Find all active bookings that have expired
    const expiredBookingsRes = await client.query(
      `SELECT * FROM bookings WHERE status = 'active' AND rent_end_date <= NOW() FOR UPDATE`
    )

    if (expiredBookingsRes.rows.length > 0) {
      const vehicleIds = expiredBookingsRes.rows.map((b: any) => b.vehicle_id)

      // Set vehicle availability back to available
      await client.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = ANY($1)`,
        [vehicleIds]
      )

      // Set booking status to returned
      await client.query(
        `UPDATE bookings SET status = 'returned' WHERE status = 'active' AND rent_end_date <= NOW()`
      )

      console.log(`Auto-returned ${expiredBookingsRes.rows.length} expired bookings.`)
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error during auto-return of expired bookings:', error)
  } finally {
    client.release()
  }
}

export const bookingsServices = {
  createBookingIntoDB,
  getAllBookingsIntoDB,
  cancelBookingIntoDB,
  returnVehicleIntoDB,
  autoReturnExpiredBookings
}
