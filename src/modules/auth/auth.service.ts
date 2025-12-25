import bcrypt from 'bcryptjs'
import { pool } from '../../database/db'
import jwt from 'jsonwebtoken'
import config from '../../database'

interface UserPayload {
  name: string
  email: string
  password: string
  role: 'admin' | 'customer'
}

const signinUserIntoDB = async (email: string, password: string) => {
  const user = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  )

  if (user.rows.length === 0) {
    throw new Error('User not found!')
  }
  const matchPassowrd = await bcrypt.compare(password, user.rows[0].password)

  if (!matchPassowrd) {
    throw new Error('Invalid Credentials!')
  }
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role
  }

  const token = jwt.sign(jwtPayload, config.jwtSecret as string, {
    expiresIn: '7d'
  })

  return { token, user: user.rows[0] }
}
const signupUserIntoDB = async (payload: UserPayload) => {
  const { name, email, password, role } = payload

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await pool.query(
    `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
    [name, email, hashedPassword, role]
  )

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role
  }

  const token = jwt.sign(jwtPayload, config.jwtSecret as string, {
    expiresIn: '7d'
  })

  console.log('JWT SECRET:', config.jwtSecret)
  console.log({ token })

  return { token, user }
}

export const authServices = {
  signinUserIntoDB,
  signupUserIntoDB
}
