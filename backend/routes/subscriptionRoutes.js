import express from 'express'
import { getSubscriptions, getSubscription, createSubscription, updateSubscription, deleteSubscription } from '../controllers/subscriptionController.js'
import { authenticate, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Admin routes
router.get('/', authorize('ADMIN'), getSubscriptions)
router.get('/:id', authorize('ADMIN'), getSubscription)
router.post('/', authorize('ADMIN'), createSubscription)
router.put('/:id', authorize('ADMIN'), updateSubscription)
router.delete('/:id', authorize('ADMIN'), deleteSubscription)

export default router