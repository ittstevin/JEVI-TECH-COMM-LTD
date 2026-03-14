import express from 'express'
import { getNetworkStatus, updateNetworkStatus, getOverallStatus } from '../controllers/networkController.js'
import { authenticate, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getNetworkStatus)
router.get('/overall', getOverallStatus)

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), updateNetworkStatus)

export default router