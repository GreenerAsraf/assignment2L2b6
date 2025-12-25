import express, { NextFunction, Request, Response } from 'express'
import { initDB } from './database/db'
import { authRoute } from './modules/auth/auth.route'
import { userRoute } from './modules/user/user.route'
import { vehicleRoute } from './modules/vehicles/vehicle.route'
import { BookingRoute } from './modules/bookings/bookings.route'

const port = process.env.PORT || 5000
const app = express()
// parser
app.use(express.json())

// Database connection
initDB()

app.use('/api/v1/users', userRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/vehicles', vehicleRoute)
app.use('/api/v1/bookings', BookingRoute)

// app.use('/api/bookings', bookingRoutes);
// app.use('/api/customers', customerRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! from Asraf from mid')
})
app.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.status(201).json({
    message: 'Data received successfully',
    data: req.body,
    success: true
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
