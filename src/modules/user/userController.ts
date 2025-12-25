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
    return res.status(201).json({
      success: true,
      message: 'User retrived',
      data: result.rows
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const email = req.customer!.email
    const result = await userServices.getSingleUserIntoDB(email)
    return res.status(201).json({
      success: true,
      message: 'User retrived',
      data: result.rows
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body
  try {
    const id = req.params.id
    const result = await userServices.updateUserIntoDB(
      name,
      email,
      id as string
    )
    return res.status(201).json({
      success: true,
      message: 'User updated',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await userServices.deleteUserIntoDB(id as string)
    return res.status(201).json({
      success: true,
      message: 'User deleted',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
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
