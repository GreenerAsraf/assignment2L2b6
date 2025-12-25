import bcrypt from 'bcryptjs'
import { pool } from '../../database/db'
import { Request, Response } from 'express'

const createUserIntoDB = async (payload: Record<string, unknown>) => {
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

const getAllUserIntoDB = async (req: Request, res: Response) => {
  const result = await pool.query(
    `
    SELECT * FROM users
    `
  )
  res.status(201).json({
    success: true,
    message: 'User retrived',
    data: result.rows
  })

  return result
}

const getSingleUserIntoDB = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id,name,email,age,created_at,updated_at FROM users WHERE email=$1
    `,
    [email]
  )

  return result
}

const updateUserIntoDB = async (name: string, email: string, id: string) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
    [name, email, id]
  )

  return result
}

const deleteUserIntoDB = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
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
