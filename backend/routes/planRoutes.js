import express from 'express'
import { getPlans, getPlan, createPlan, updatePlan, deletePlan } from '../controllers/planController.js'
import { authenticate, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getPlans)
router.get('/:id', getPlan)

// Admin only routes
router.post('/', authenticate, authorize('ADMIN'), createPlan)
router.put('/:id', authenticate, authorize('ADMIN'), updatePlan)
router.delete('/:id', authenticate, authorize('ADMIN'), deletePlan)

export default router