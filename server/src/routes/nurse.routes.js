const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/nurses
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = search ? { OR: [{ user: { firstName: { contains: search, mode: 'insensitive' } } }, { user: { lastName: { contains: search, mode: 'insensitive' } } }] } : {};
    const [nurses, total] = await Promise.all([
      prisma.nurse.findMany({ where, include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true } }, department: true }, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
      prisma.nurse.count({ where }),
    ]);
    res.json({ data: nurses, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// POST /api/nurses
router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, departmentId, shiftType, qualification, wardAssignment } = req.body;
    const role = await prisma.role.findUnique({ where: { name: 'NURSE' } });
    const hashedPassword = await bcrypt.hash(password || 'Nurse@123', 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, phone, roleId: role.id, nurse: { create: { departmentId: departmentId ? parseInt(departmentId) : null, shiftType, qualification, wardAssignment } } },
      include: { nurse: { include: { department: true } }, role: true },
    });
    const { password: _, ...data } = user;
    res.status(201).json(data);
  } catch (error) { next(error); }
});

// PUT /api/nurses/:id
router.put('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { departmentId, shiftType, qualification, wardAssignment } = req.body;
    const nurse = await prisma.nurse.update({
      where: { id: parseInt(req.params.id) },
      data: { departmentId: departmentId ? parseInt(departmentId) : undefined, shiftType, qualification, wardAssignment },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } }, department: true },
    });
    res.json(nurse);
  } catch (error) { next(error); }
});

// DELETE /api/nurses/:id
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const nurse = await prisma.nurse.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!nurse) return res.status(404).json({ error: 'Nurse not found.' });
    await prisma.user.delete({ where: { id: nurse.userId } });
    res.json({ message: 'Nurse deleted successfully.' });
  } catch (error) { next(error); }
});

module.exports = router;
