import express from 'express'
import { getUsers, getUser, updateUser, suspendUser, getUserStats } from '../controllers/userController.js'
import { authenticate, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Admin only routes
router.get('/stats', authorize('ADMIN'), getUserStats)
router.get('/', authorize('ADMIN'), getUsers)
router.get('/:id', authorize('ADMIN'), getUser)
router.put('/:id', authorize('ADMIN'), updateUser)
router.post('/:id/suspend', authorize('ADMIN'), suspendUser)

export default router