import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
  createMessage,
  getMessages,
  getMessage,
  deleteMessage,
} from '../controllers/messageController.js';

const router = Router();

// Public: Submit a contact message
router.post('/', createMessage);

// Admin: Get all messages
router.get('/', authenticate, authorize('ADMIN'), getMessages);

// Admin: Get a single message
router.get('/:id', authenticate, authorize('ADMIN'), getMessage);

// Admin: Delete a message
router.delete('/:id', authenticate, authorize('ADMIN'), deleteMessage);

export default router;
