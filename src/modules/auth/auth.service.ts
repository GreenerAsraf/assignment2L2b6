import bcrypt from 'bcryptjs'
import { pool } from '../../database/db'
import jwt from 'jsonwebtoken'
import config from '../../database'

interface UserPayload {
  name: string
  email: string
  password: string
  phone: string
  role: 'admin' | 'customer'
}

const signinUserIntoDB = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [normalizedEmail]
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

  // Exclude password from the returned user details
  const { password: _, ...userWithoutPassword } = user.rows[0]

  return { token, user: userWithoutPassword }
}
const signupUserIntoDB = async (payload: UserPayload) => {
  const { name, email, password, phone, role } = payload

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long!')
  }

  if (!phone) {
    throw new Error('Phone number is required!')
  }

  const normalizedEmail = email.trim().toLowerCase()

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await pool.query(
    `
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, role, age, created_at, updated_at
        `,
    [name, normalizedEmail, hashedPassword, phone, role || 'customer']
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

  return { token, user: user.rows[0] }
}

export const authServices = {
  signinUserIntoDB,
  signupUserIntoDB
}
