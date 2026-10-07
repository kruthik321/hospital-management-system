const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/lab/tests - List all lab test types
router.get('/tests', authenticate, async (req, res, next) => {
  try {
    const tests = await prisma.labTest.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    res.json(tests);
  } catch (error) { next(error); }
});

// POST /api/lab/tests
router.post('/tests', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { name, category, description, cost, normalRange, unit } = req.body;
    const test = await prisma.labTest.create({ data: { name, category, description, cost: parseFloat(cost) || 0, normalRange, unit } });
    res.status(201).json(test);
  } catch (error) { next(error); }
});

// GET /api/lab/orders
router.get('/orders', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const role = req.user.role.name;
    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
      where.patientId = patient.id;
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
      where.doctorId = doctor.id;
    }
    if (status) where.status = status;
    if (patientId) where.patientId = parseInt(patientId);

    const [orders, total] = await Promise.all([
      prisma.labOrder.findMany({
        where,
        include: {
          patient: { include: { user: { select: { firstName: true, lastName: true } } } },
          doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
          labTest: true, labReport: true,
        },
        skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
      }),
      prisma.labOrder.count({ where }),
    ]);
    res.json({ data: orders, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// POST /api/lab/orders
router.post('/orders', authenticate, authorize('DOCTOR', 'ADMIN'), async (req, res, next) => {
  try {
    const { patientId, labTestId, priority } = req.body;
    let doctorId;
    if (req.user.role.name === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
      doctorId = doctor.id;
    } else {
      doctorId = parseInt(req.body.doctorId);
    }
    const order = await prisma.labOrder.create({
      data: { patientId: parseInt(patientId), doctorId, labTestId: parseInt(labTestId), priority: priority || 'NORMAL' },
      include: { labTest: true, patient: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });
    res.status(201).json(order);
  } catch (error) { next(error); }
});

// POST /api/lab/reports
router.post('/reports', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
  try {
    const { labOrderId, result, resultValue, remarks, reportedBy } = req.body;
    const report = await prisma.labReport.create({
      data: { labOrderId: parseInt(labOrderId), result, resultValue, remarks, reportedBy, reportedAt: new Date() },
    });
    await prisma.labOrder.update({ where: { id: parseInt(labOrderId) }, data: { status: 'COMPLETED' } });
    // Notify patient
    const order = await prisma.labOrder.findUnique({ where: { id: parseInt(labOrderId) }, include: { patient: true } });
    await prisma.notification.create({
      data: { userId: order.patient.userId, title: 'Lab Report Ready', message: 'Your lab test report is now available.', type: 'LAB_RESULT', link: '/patient/reports' },
    });
    res.status(201).json(report);
  } catch (error) { next(error); }
});

module.exports = router;
