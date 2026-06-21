import { Request, Response } from 'express'
import { userServices } from './userService'

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUserIntoDB(req.body)
    return res.status(201).json({
      success: true,
      message: 'usser created',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUserIntoDB(req, res)
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const email = req.customer!.email
    const result = await userServices.getSingleUserIntoDB(email)
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const customer = req.customer

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized!'
      })
    }

    // Customer can only update their own profile
    if (customer.role === 'customer' && String(customer.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden! You can only update your own profile.'
      })
    }

    const payload = { ...req.body }
    // Customer cannot change their own role
    if (customer.role === 'customer') {
      delete payload.role
    }

    const result = await userServices.updateUserIntoDB(
      payload,
      id as string
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await userServices.deleteUserIntoDB(id as string)
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
}
