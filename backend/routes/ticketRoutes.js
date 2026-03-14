import express from 'express'
import { getTickets, getTicket, createTicket, updateTicket, getTicketStats } from '../controllers/ticketController.js'
import { authenticate, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Customer can create and view their own tickets
router.post('/', createTicket)
router.get('/my', getTickets) // Filtered by userId

// Admin/Support routes
router.get('/stats', authorize('ADMIN', 'SUPPORT'), getTicketStats)
router.get('/', authorize('ADMIN', 'SUPPORT'), getTickets)
router.get('/:id', authorize('ADMIN', 'SUPPORT'), getTicket)
router.put('/:id', authorize('ADMIN', 'SUPPORT'), updateTicket)

export default router