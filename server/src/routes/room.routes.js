const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/rooms
router.get('/', authenticate, authorize('ADMIN', 'NURSE', 'DOCTOR'), async (req, res, next) => {
  try {
    const { type, department } = req.query;
    const where = { ...(type && { type }), ...(department && { departmentId: parseInt(department) }) };
    const rooms = await prisma.room.findMany({
      where, include: { department: true, beds: { include: { roomAssignments: { where: { status: 'ACTIVE' }, include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } } } } } } },
      orderBy: { roomNumber: 'asc' },
    });
    res.json(rooms);
  } catch (error) { next(error); }
});

// POST /api/rooms
router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { roomNumber, departmentId, type, floor, charges, bedCount } = req.body;
    const room = await prisma.room.create({
      data: {
        roomNumber, departmentId: departmentId ? parseInt(departmentId) : null, type, floor, charges: parseFloat(charges) || 0,
        beds: { create: Array.from({ length: parseInt(bedCount) || 1 }, (_, i) => ({ bedNumber: `${roomNumber}-B${i + 1}` })) },
      },
      include: { beds: true, department: true },
    });
    res.status(201).json(room);
  } catch (error) { next(error); }
});

// POST /api/rooms/assign
router.post('/assign', authenticate, authorize('ADMIN', 'NURSE'), async (req, res, next) => {
  try {
    const { patientId, bedId } = req.body;
    await prisma.bed.update({ where: { id: parseInt(bedId) }, data: { isOccupied: true } });
    const assignment = await prisma.roomAssignment.create({
      data: { patientId: parseInt(patientId), bedId: parseInt(bedId) },
      include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } }, bed: { include: { room: true } } },
    });
    res.status(201).json(assignment);
  } catch (error) { next(error); }
});

// PUT /api/rooms/discharge/:assignmentId
router.put('/discharge/:assignmentId', authenticate, authorize('ADMIN', 'NURSE'), async (req, res, next) => {
  try {
    const assignment = await prisma.roomAssignment.update({
      where: { id: parseInt(req.params.assignmentId) },
      data: { status: 'DISCHARGED', dischargedAt: new Date() },
    });
    await prisma.bed.update({ where: { id: assignment.bedId }, data: { isOccupied: false } });
    res.json(assignment);
  } catch (error) { next(error); }
});

// DELETE /api/rooms/:id
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await prisma.room.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Room deleted.' });
  } catch (error) { next(error); }
});

module.exports = router;
