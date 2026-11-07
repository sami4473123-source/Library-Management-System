import { Router } from 'express';
import { getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.route('/').get(getBooks).post(createBook);
router.route('/:id').put(updateBook).delete(deleteBook);
export default router;
