import express from 'express'
import { getPayments, getPayment, createPayment, updatePayment, getPaymentStats } from '../controllers/paymentController.js'
import { authenticate, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Customer can view their own payments
router.get('/my', getPayments) // This will be filtered by userId in controller

// Admin routes
router.get('/stats', authorize('ADMIN'), getPaymentStats)
router.get('/', authorize('ADMIN'), getPayments)
router.get('/:id', authorize('ADMIN'), getPayment)
router.post('/', authorize('ADMIN'), createPayment)
router.put('/:id', authorize('ADMIN'), updatePayment)

export default router