import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Loan from '../models/Loan.js';

export const getDashboardStats = async (_req, res, next) => {
  try {
    const [books, members, activeLoans, returnedLoans, inventory, recentLoans, overdue] = await Promise.all([
      Book.countDocuments(), Member.countDocuments(), Loan.countDocuments({ status: 'Issued' }),
      Loan.countDocuments({ status: 'Returned' }),
      Book.aggregate([{ $group: { _id: null, copies: { $sum: '$totalCopies' }, available: { $sum: '$availableCopies' } } }]),
      Loan.find().populate('book', 'title').populate('member', 'name').sort({ createdAt: -1 }).limit(6),
      Loan.countDocuments({ status: 'Issued', dueDate: { $lt: new Date() } })
    ]);
    res.json({ books, members, activeLoans, returnedLoans, overdue, totalCopies: inventory[0]?.copies || 0, availableCopies: inventory[0]?.available || 0, recentLoans });
  } catch (error) { next(error); }
};
