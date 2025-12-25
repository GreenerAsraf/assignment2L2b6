import bcrypt from 'bcryptjs'

import { pool } from '../../database/db'
const createBookingIntoDB = async (payload: Record<string, string>) => {
  const { name, email, password, role } = payload

  const hashPassword = await bcrypt.hash(password as string, 12)

  const result = await pool.query(
    `
      INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,age,created_at,updated_at,role
    `,
    [name, email, hashPassword, role]
  )

  //   delete result.rows[0].password

  return result
}

const getAllBookingsIntoDB = async () => {
  const result = await pool.query(
    `
    SELECT * FROM bookings
    `
  )
  return result
}

const updateBookingIntoDB = async (name: string, email: string, id: string) => {
  const result = await pool.query(
    `UPDATE bookings SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
    [name, email, id]
  )
  return result
}

export const bookingsServices = {
  createBookingIntoDB,
  getAllBookingsIntoDB,
  updateBookingIntoDB
}
