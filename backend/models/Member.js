import mongoose from 'mongoose';
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  memberId: { type: String, required: true, unique: true, trim: true },
  department: { type: String, default: 'General' }
}, { timestamps: true });
memberSchema.index({ email: 1 }, { unique: true });
export default mongoose.model('Member', memberSchema);
