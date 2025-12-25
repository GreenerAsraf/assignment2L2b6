import { Request, Response } from 'express'
import { vehicleServices } from './vehicleService'

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicleIntoDB(req.body)
    console.log(result, 'result from controller created vehicle')
    return res.status(201).json({
      success: true,
      message: 'vehicle created',
      data: result
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicleIntoDB()
    return res.status(201).json({
      success: true,
      message: 'All vehicle retrived',
      data: result.rows
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicleIntoDB(req, res)
    return res.status(201).json({
      success: true,
      message: 'single vehicle is retrived',
      data: result.rows
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

const updateVehicle = async (req: Request, res: Response) => {
  // Implementation for updating a vehicle

  try {
    console.log(
      req.params.vehicleId,
      'vehicleId from controller',
      req.params.id
    )
    const { vehicleId } = req.params
    const { vehicle_name, daily_rent_price, availability_status } = req.body

    const result = await vehicleServices.updateVehicleIntoDB(
      vehicle_name,
      daily_rent_price,
      availability_status,
      vehicleId as string
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      })
    } else {
      return res.status(200).json({
        success: true,
        message: 'vehicle is updated',
        data: result.rows[0]
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message
    })
  }
}
const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params
    const result = await vehicleServices.deleteVehicleIntoDB(
      vehicleId as string
    )
    return res.status(201).json({
      success: true,
      message: 'vehicle deleted',
      data: result.rows[0]
    })
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message
    })
  }
}

export const vehicleController = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
}
