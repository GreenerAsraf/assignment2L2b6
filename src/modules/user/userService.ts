import bcrypt from 'bcryptjs'
import { pool } from '../../database/db'
import { Request, Response } from 'express'

const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload

  const hashPassword = await bcrypt.hash(password as string, 12)

  const result = await pool.query(
    `
      INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, age, created_at, updated_at, role
    `,
    [name, (email as string).trim().toLowerCase(), hashPassword, phone, role || 'customer']
  )

  return result
}

const getAllUserIntoDB = async (req: Request, res: Response) => {
  const result = await pool.query(
    `
    SELECT id, name, email, phone, role, age, created_at, updated_at FROM users
    `
  )
  res.status(200).json({
    success: true,
    message: 'Users retrieved',
    data: result.rows
  })

  return result
}

const getSingleUserIntoDB = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id, name, email, phone, role, age, created_at, updated_at FROM users WHERE email=$1
    `,
    [email]
  )

  return result
}

const updateUserIntoDB = async (payload: Record<string, any>, id: string) => {
  const fields: string[] = []
  const values: any[] = []
  let index = 1

  if (payload.name !== undefined) {
    fields.push(`name = $${index++}`)
    values.push(payload.name)
  }
  if (payload.email !== undefined) {
    fields.push(`email = $${index++}`)
    values.push(payload.email.trim().toLowerCase())
  }
  if (payload.phone !== undefined) {
    fields.push(`phone = $${index++}`)
    values.push(payload.phone)
  }
  if (payload.role !== undefined) {
    fields.push(`role = $${index++}`)
    values.push(payload.role)
  }

  if (fields.length === 0) {
    const result = await pool.query(`SELECT id, name, email, phone, role, age, created_at, updated_at FROM users WHERE id = $1`, [id])
    return result
  }

  values.push(id)
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, email, phone, role, age, created_at, updated_at`
  const result = await pool.query(query, values)
  return result
}

const deleteUserIntoDB = async (id: string) => {
  // Check if active bookings exist for the user
  const activeBookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  )
  if (activeBookings.rows.length > 0) {
    throw new Error('Cannot delete user. Active bookings exist for this customer!')
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING id, name, email, phone, role, age, created_at, updated_at`, [
    id
  ])

  return result
}

export const userServices = {
  createUserIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  updateUserIntoDB,
  deleteUserIntoDB
}
