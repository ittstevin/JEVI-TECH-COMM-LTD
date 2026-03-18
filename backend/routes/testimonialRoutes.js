import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
  createTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  approveTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';

const router = Router();

// Public: Get approved testimonials
router.get('/', getApprovedTestimonials);

// User: Submit a testimonial (requires login)
router.post('/', authenticate, createTestimonial);

// Admin: Get all testimonials
router.get('/admin/all', authenticate, authorize('ADMIN'), getAllTestimonials);

// Admin: Approve a testimonial
router.patch('/admin/approve/:id', authenticate, authorize('ADMIN'), approveTestimonial);

// Admin: Delete a testimonial
router.delete('/admin/:id', authenticate, authorize('ADMIN'), deleteTestimonial);

export default router;
