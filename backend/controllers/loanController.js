import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';

export const getLoans = async (req, res, next) => {
  try {
    const q = (req.query.search || '').trim().toLowerCase();
    const loans = await Loan.find().populate('book', 'title author').populate('member', 'name memberId').sort({ createdAt: -1 });
    res.json(q ? loans.filter(item =>
      (item.book?.title || '').toLowerCase().includes(q) ||
      (item.member?.name || '').toLowerCase().includes(q) ||
      (item.member?.memberId || '').toLowerCase().includes(q)) : loans);
  } catch (error) { next(error); }
};

export const issueBook = async (req, res, next) => {
  try {
    const { bookId, memberId, dueDate } = req.body;
    if (!bookId || !memberId || !dueDate || new Date(dueDate) <= new Date())
      return res.status(400).json({ message: 'Select a book, member and future due date' });
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No available copies' });
    if (!await Member.findById(memberId)) return res.status(404).json({ message: 'Member not found' });
    book.availableCopies -= 1;
    await book.save();
    try {
      const loan = await Loan.create({ book: bookId, member: memberId, dueDate: new Date(dueDate) });
      res.status(201).json(await loan.populate([{ path: 'book', select: 'title author' }, { path: 'member', select: 'name memberId' }]));
    } catch (error) {
      book.availableCopies += 1;
      await book.save();
      throw error;
    }
  } catch (error) { next(error); }
};

export const returnBook = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status === 'Returned') return res.status(400).json({ message: 'Book already returned' });
    const returnedAt = new Date();
    const lateDays = Math.max(0, Math.ceil((returnedAt - loan.dueDate) / 86400000));
    loan.status = 'Returned';
    loan.returnDate = returnedAt;
    loan.fine = lateDays * Number(process.env.FINE_PER_DAY || 5);
    await loan.save();
    await Book.findByIdAndUpdate(loan.book, { $inc: { availableCopies: 1 } });
    res.json(await loan.populate([{ path: 'book', select: 'title author' }, { path: 'member', select: 'name memberId' }]));
  } catch (error) { next(error); }
};
