import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  sendInvitation,
  respondToInvitation,
  getInvitations,
  getFollowers,
  getSentInvitations,
  getReceivedInvitations,
} from '../controllers/innerCircle.controller';

const router = Router();

// Protected routes
router.post('/invite', authenticate, sendInvitation);
router.post('/invite/:invitationId/respond', authenticate, respondToInvitation);
router.get('/invitations', authenticate, getInvitations);
router.get('/followers', authenticate, getFollowers);
router.get('/sent-invitations', authenticate, getSentInvitations);
router.get('/received-invitations', authenticate, getReceivedInvitations);

export default router; 