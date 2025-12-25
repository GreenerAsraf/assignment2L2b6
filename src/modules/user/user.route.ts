import { Router } from 'express'
import { userController } from './userController'
import { Roles } from '../auth/auth.constant'
import auth from '../../middleware/auth'

const router = Router()

router.post('/', userController.createUser)
router.get('/', auth(Roles.admin), userController.getAllUser)
router.get(
  '/:id',
  auth(Roles.customer) || auth(Roles.admin),
  userController.getSingleUser
)
router.put(
  '/:id',
  auth(Roles.customer) || auth(Roles.admin),
  userController.updateUser
)
router.delete('/:id', auth(Roles.admin), userController.deleteUser)
export const userRoute = router
