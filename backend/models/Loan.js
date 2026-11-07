import mongoose from 'mongoose';
const loanSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
  fine: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model('Loan', loanSchema);
