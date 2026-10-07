const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/emergency
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR', 'NURSE'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const cases = await prisma.emergencyCase.findMany({
      where, include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { arrivedAt: 'desc' },
    });
    res.json(cases);
  } catch (error) { next(error); }
});

// POST /api/emergency
router.post('/', authenticate, authorize('ADMIN', 'DOCTOR', 'NURSE'), async (req, res, next) => {
  try {
    const { patientId, description, severity, assignedTo } = req.body;
    const emergencyCase = await prisma.emergencyCase.create({
      data: { patientId: patientId ? parseInt(patientId) : null, description, severity, assignedTo },
      include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });
    res.status(201).json(emergencyCase);
  } catch (error) { next(error); }
});

// PUT /api/emergency/:id
router.put('/:id', authenticate, authorize('ADMIN', 'DOCTOR', 'NURSE'), async (req, res, next) => {
  try {
    const { status, notes, assignedTo } = req.body;
    const updated = await prisma.emergencyCase.update({
      where: { id: parseInt(req.params.id) },
      data: { status, notes, assignedTo, ...(status === 'RESOLVED' && { resolvedAt: new Date() }) },
    });
    res.json(updated);
  } catch (error) { next(error); }
});

module.exports = router;
