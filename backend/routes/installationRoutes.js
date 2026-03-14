import express from 'express'
import { getInstallations, getInstallation, createInstallation, updateInstallation } from '../controllers/installationController.js'
import { authenticate, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Customer can create and view their own installations
router.post('/', createInstallation)
router.get('/my', getInstallations) // Filtered by userId

// Admin routes
router.get('/', authorize('ADMIN'), getInstallations)
router.get('/:id', authorize('ADMIN'), getInstallation)
router.put('/:id', authorize('ADMIN'), updateInstallation)

export default router