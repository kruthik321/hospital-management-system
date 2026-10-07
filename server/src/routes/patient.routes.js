const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/patients - List all patients
router.get('/', authenticate, authorize('ADMIN', 'DOCTOR', 'NURSE'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = search ? {
      OR: [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ],
    } : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true, avatar: true } } },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({ data: patients, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
});

// GET /api/patients/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } },
        appointments: { include: { doctor: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { appointmentDate: 'desc' }, take: 10 },
        prescriptions: { orderBy: { createdAt: 'desc' }, take: 10 },
        vitals: { orderBy: { recordedAt: 'desc' }, take: 10 },
        diagnoses: { orderBy: { diagnosedAt: 'desc' }, take: 10 },
        insurance: true,
      },
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });
    res.json(patient);
  } catch (error) {
    next(error);
  }
});

// PUT /api/patients/:id
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { dateOfBirth, gender, bloodGroup, address, city, state, zipCode, emergencyContact, emergencyPhone, allergies } = req.body;
    const patient = await prisma.patient.update({
      where: { id: parseInt(req.params.id) },
      data: { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, gender, bloodGroup, address, city, state, zipCode, emergencyContact, emergencyPhone, allergies },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } } },
    });
    res.json(patient);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/patients/:id
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });
    await prisma.user.delete({ where: { id: patient.userId } });
    res.json({ message: 'Patient deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/patients/:id/medical-history
router.get('/:id/medical-history', authenticate, async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.id);
    const [records, diagnoses, prescriptions, labOrders, vitals] = await Promise.all([
      prisma.medicalRecord.findMany({ where: { patientId }, orderBy: { createdAt: 'desc' } }),
      prisma.diagnosis.findMany({ where: { patientId }, include: { doctor: { include: { user: { select: { firstName: true, lastName: true } } } }, treatmentPlans: true }, orderBy: { diagnosedAt: 'desc' } }),
      prisma.prescription.findMany({ where: { patientId }, include: { items: { include: { medication: true } }, doctor: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { createdAt: 'desc' } }),
      prisma.labOrder.findMany({ where: { patientId }, include: { labTest: true, labReport: true }, orderBy: { createdAt: 'desc' } }),
      prisma.vital.findMany({ where: { patientId }, orderBy: { recordedAt: 'desc' }, take: 20 }),
    ]);
    res.json({ records, diagnoses, prescriptions, labOrders, vitals });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
