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
        phone VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`)

  // Run ALTER to make sure phone exists on users table in case it was created previously without it
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(100);`)
  } catch (err) {
    console.error('Error altering users table:', err)
  }

  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC CHECK (daily_rent_price > 0) NOT NULL,
    availability_status VARCHAR(10) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available'
  );`)

  await pool.query(`CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date TIMESTAMP NOT NULL,
    rent_end_date TIMESTAMP NOT NULL,
    total_price NUMERIC CHECK (total_price > 0) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active',
    CONSTRAINT check_dates CHECK (rent_end_date > rent_start_date)
  );`)

  console.log('Database Connected and Initialized')
}
