import { Request, Response } from 'express'
import { bookingsServices } from './bookings.service'
import { userServices } from '../user/userService'

const createBooking = async (req: Request, res: Response) => {
  try {
    const customer = req.customer
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized!'
      })
    }

    const { vehicle_id, rent_start_date, rent_end_date } = req.body
    
    // For admin, allow specifying customer_id, otherwise use current logged-in user id
    const customer_id = customer.role === 'admin' && req.body.customer_id 
      ? Number(req.body.customer_id) 
      : Number(customer.id)

    const result = await bookingsServices.createBookingIntoDB({
      customer_id,
      vehicle_id: Number(vehicle_id),
      rent_start_date,
      rent_end_date
    })

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const listBookings = async (req: Request, res: Response) => {
  try {
    const customer = req.customer
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized!'
      })
    }

    const result = await bookingsServices.getAllBookingsIntoDB(
      Number(customer.id),
      customer.role as string
    )
    
    return res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: result.rows
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateBooking = async (req: Request, res: Response) => {
  try {
    const customer = req.customer
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized!'
      })
    }

    const { bookingId } = req.params
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required!'
      })
    }

    let result
    if (customer.role === 'customer') {
      // Customer cancels
      result = await bookingsServices.cancelBookingIntoDB(bookingId, Number(customer.id))
    } else if (customer.role === 'admin') {
      // Admin marks returned
      result = await bookingsServices.returnVehicleIntoDB(bookingId)
    } else {
      return res.status(403).json({
        success: false,
        message: 'Forbidden!'
      })
    }

    return res.status(200).json({
      success: true,
      message: customer.role === 'customer' ? 'Booking cancelled successfully' : 'Vehicle marked as returned successfully',
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const bookingsController = {
  createBooking,
  listBookings,
  updateBooking
}
