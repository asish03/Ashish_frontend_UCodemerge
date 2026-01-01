import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { users } from '../data/mockData.js';

const router = express.Router();

router.get('/', verifyToken, requireRole('owner'), (req, res) => {
  const userList = users.map(({ password, ...user }) => user);
  res.json({ users: userList, total: userList.length });
});

router.post('/', verifyToken, requireRole('owner'), async (req, res) => {
  const { email, name, role = 'developer' } = req.body;

  if (!email || !name) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Email and name are required'
    });
  }

  if (users.find(u => u.email === email)) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'User with this email already exists'
    });
  }

  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword,
    name,
    role,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastActive: null
  };

  users.push(newUser);

  const { password, ...userWithoutPassword } = newUser;

  res.status(201).json({
    ...userWithoutPassword,
    tempPassword,
    invitationSent: true
  });
});

router.put('/:userId/role', verifyToken, requireRole('owner'), (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['owner', 'developer'].includes(role)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid role'
    });
  }

  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: 'User not found' });
  }

  user.role = role;
  user.updatedAt = new Date().toISOString();

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.delete('/:userId', verifyToken, requireRole('owner'), (req, res) => {
  const { userId } = req.params;

  if (userId === req.user.id) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Cannot delete your own account'
    });
  }

  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.json({ success: true, message: 'User deleted successfully' });
});

export default router;
