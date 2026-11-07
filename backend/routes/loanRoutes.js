import { Router } from 'express';
import { getLoans, issueBook, returnBook } from '../controllers/loanController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.route('/').get(getLoans).post(issueBook);
router.patch('/:id/return', returnBook);
export default router;
