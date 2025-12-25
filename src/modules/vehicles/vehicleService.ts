import bcrypt from 'bcryptjs'
import { pool } from '../../database/db'
import { Request, Response } from 'express'

const createVehicleIntoDB = async (payload: Record<string, any>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status
  } = payload
  // 2. Insert the new vehicle into the database
  const result = await pool.query(
    `
    INSERT INTO vehicles (
      vehicle_name, 
      type, 
      registration_number, 
      daily_rent_price, 
      availability_status
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status;
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status || 'available'
    ]
  )

  return result.rows[0] // Return the first row specifically
}
const getAllVehicleIntoDB = async () => {
  const result = await pool.query(` SELECT * FROM vehicles `)
  return result
}

const getSingleVehicleIntoDB = async (req: Request, res: Response) => {
  const result = await pool.query(
    ` SELECT * FROM vehicles WHERE id=$1
    `,
    [req.params.vehicleId]
  )

  return result
}
const updateVehicleIntoDB = async (
  vehicle_name: string,
  daily_rent_price: string,
  availability_status: string,
  vehicleId: string
) => {
  const result = await pool.query(
    `
    UPDATE vehicles
    SET vehicle_name = $1,daily_rent_price = $2, availability_status = $3 
    WHERE id = $4
    RETURNING *
    `,
    [vehicle_name, daily_rent_price, availability_status, vehicleId]
  )

  return result
}

const deleteVehicleIntoDB = async (vehicleId: string) => {
  const result = await pool.query(
    `
    DELETE FROM vehicles WHERE id = $1 RETURNING *;
    `,
    [vehicleId]
  )
  return result
}

export const vehicleServices = {
  createVehicleIntoDB,
  getAllVehicleIntoDB,
  getSingleVehicleIntoDB,
  updateVehicleIntoDB,
  deleteVehicleIntoDB
}
