import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { pool } from '../database/db'
import config from '../database'

// const auth = (...roles: ('admin' | 'customer')[]) => {
//   //['admin']
//   return async (req: Request, res: Response, next: NextFunction) => {
//     // const token = req.headers.authorization?.split(' ')[1]
//     const token = req.headers.authorization
//     const secret = process.env.JWT_SECRET;
//     // 'bearer njksd;kfbsk;df;ksd'  ['bearer','jkasndknf']
//     if (!token) {
//       throw new Error('You are not authorized')
//     }
//     const decoded = jwt.verify(token, config.jwtSecret as string)

//     const user = await pool.query(
//       `
//       SELECT * FROM users WHERE email=$1
//       `,
//       [decoded.email]
//     )
//     if (user.rows.length === 0) {
//       throw new Error('User not found!')
//     }
//     req.customer = decoded
//     if (roles.length && !roles.includes(decoded.role)) {
//       throw new Error('You are not authorized')
//     }
//     next()
//   }
// }
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'You are not authorized! Token is missing.'
        })
      }

      // Check for Bearer prefix and extract token
      let token = authHeader
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1] || ''
      }

      let decoded: JwtPayload
      try {
        decoded = jwt.verify(
          token,
          config.jwtSecret as string
        ) as JwtPayload
      } catch (jwtErr: any) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized! Invalid token.'
        })
      }

      console.log({ decoded })
      req.customer = decoded

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden! You do not have permission to access this resource.'
        })
      }

      next()
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }
}
export default auth
