import { Request, Response } from 'express'
import { bookingsServices } from './bookings.service'
import { userServices } from '../user/userService'

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.createBookingIntoDB(req.body)
    return res.status(201).json({
      success: true,
      message: 'Booking created',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}
// const result = await bookingsServices.createBookingIntoDB(req.body)
const listBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.getAllBookingsIntoDB()
    return res.status(200).json({
      success: true,
      message: 'Bookings retrieved',
      data: result.rows
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId
    const { name, email } = req.body

    const result = await bookingsServices.updateBookingIntoDB(
      name,
      email,
      bookingId as string
    )
    return res.status(200).json({
      success: true,
      message: 'Booking updated',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

export const bookingsController = {
  createBooking,
  listBookings,
  updateBooking
}
