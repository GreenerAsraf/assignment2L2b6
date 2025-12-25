import { Router } from 'express'
import { vehicleController } from './vehicleController'
import { Roles } from '../auth/auth.constant'
import auth from '../../middleware/auth'

const router = Router()

router.post('/', auth(Roles.admin), vehicleController.createVehicle)
router.get('/', auth(Roles.customer), vehicleController.getAllVehicle)
router.get('/:vehicleId', vehicleController.getSingleVehicle)
router.put('/:vehicleId', auth(Roles.admin), vehicleController.updateVehicle)
router.delete('/:vehicleId', auth(Roles.admin), vehicleController.deleteVehicle)
export const vehicleRoute = router
