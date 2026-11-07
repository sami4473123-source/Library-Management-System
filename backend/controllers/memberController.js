import Member from '../models/Member.js';
import Loan from '../models/Loan.js';

export const getMembers = async (req, res, next) => {
  try {
    const q = (req.query.search || '').trim();
    const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }, { memberId: new RegExp(q, 'i') }] } : {};
    res.json(await Member.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
};
export const createMember = async (req, res, next) => {
  try {
    const { name, email, phone, memberId, department } = req.body;
    if (!name || !email || !memberId) return res.status(400).json({ message: 'Name, email and member ID are required' });
    res.status(201).json(await Member.create({ name, email, phone, memberId, department }));
  } catch (error) { next(error); }
};
export const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) { next(error); }
};
export const deleteMember = async (req, res, next) => {
  try {
    if (await Loan.exists({ member: req.params.id, status: 'Issued' }))
      return res.status(400).json({ message: 'This member has an active loan' });
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (error) { next(error); }
};
