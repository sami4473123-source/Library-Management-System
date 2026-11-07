import Book from '../models/Book.js';
import Loan from '../models/Loan.js';

export const getBooks = async (req, res, next) => {
  try {
    const q = (req.query.search || '').trim();
    const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }, { isbn: new RegExp(q, 'i') }] } : {};
    res.json(await Book.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
};

export const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;
    const total = Number(totalCopies);
    if (!title || !author || !Number.isInteger(total) || total < 1)
      return res.status(400).json({ message: 'Title, author and valid copy count are required' });
    res.status(201).json(await Book.create({ title, author, isbn: isbn || undefined, category, totalCopies: total, availableCopies: total }));
  } catch (error) { next(error); }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const { title, author, isbn, category, totalCopies } = req.body;
    if (totalCopies !== undefined) {
      const total = Number(totalCopies);
      const issued = book.totalCopies - book.availableCopies;
      if (!Number.isInteger(total) || total < issued)
        return res.status(400).json({ message: 'Total copies cannot be less than copies currently issued' });
      book.totalCopies = total;
      book.availableCopies = total - issued;
    }
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) book.isbn = isbn || undefined;
    if (category !== undefined) book.category = category;
    await book.save();
    res.json(book);
  } catch (error) { next(error); }
};

export const deleteBook = async (req, res, next) => {
  try {
    if (await Loan.exists({ book: req.params.id, status: 'Issued' }))
      return res.status(400).json({ message: 'Return active loans before deleting this book' });
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) { next(error); }
};
