import { Pool } from 'pg'
import config from '.'

export const pool = new Pool({ connectionString: `${config.connection_str}` })

export const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(100) NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`)

  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC CHECK (daily_rent_price > 0) NOT NULL,
    availability_status VARCHAR(10) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available'
  );`)

  console.log('Database Connected and Initialized')
}
