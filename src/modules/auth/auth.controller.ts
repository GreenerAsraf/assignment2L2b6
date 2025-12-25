import { Request, Response } from 'express'
import { authServices } from './auth.service'

const signin = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signinUserIntoDB(
      req.body.email,
      req.body.password
    )
    return res.status(201).json({
      success: true,
      message: 'User signed in successfully',
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}
const signup = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupUserIntoDB(req.body)
    return res.status(201).json({
      success: true,
      message: 'User signed up successfully',
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const authController = {
  signin,
  signup
}
