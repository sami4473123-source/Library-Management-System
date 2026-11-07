import { Router } from 'express';
import { getMembers, createMember, updateMember, deleteMember } from '../controllers/memberController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.route('/').get(getMembers).post(createMember);
router.route('/:id').put(updateMember).delete(deleteMember);
export default router;
