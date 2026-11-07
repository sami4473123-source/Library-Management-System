import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8)
      return res.status(400).json({ message: 'Name, email and password (8+ characters) are required' });
    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Admin email already exists' });
    const admin = await Admin.create({ name, email, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ message: 'Admin account created', admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) { next(error); }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: (email || '').toLowerCase() });
    if (!admin || !(await bcrypt.compare(password || '', admin.password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) { next(error); }
};
