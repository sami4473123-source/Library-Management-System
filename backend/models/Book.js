import mongoose from 'mongoose';
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, trim: true, unique: true, sparse: true },
  category: { type: String, default: 'General', trim: true },
  totalCopies: { type: Number, required: true, min: 0, default: 1 },
  availableCopies: { type: Number, required: true, min: 0, default: 1 }
}, { timestamps: true });
export default mongoose.model('Book', bookSchema);
