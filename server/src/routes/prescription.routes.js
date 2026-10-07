const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/prescriptions
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, patientId } = req.query;
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
    if (patientId) where.patientId = parseInt(patientId);

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        include: {
          patient: { include: { user: { select: { firstName: true, lastName: true } } } },
          doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
          items: { include: { medication: true } },
        },
        skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
      }),
      prisma.prescription.count({ where }),
    ]);
    res.json({ data: prescriptions, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// POST /api/prescriptions
router.post('/', authenticate, authorize('DOCTOR'), async (req, res, next) => {
  try {
    const { patientId, appointmentId, diagnosisNotes, instructions, followUpDate, items } = req.body;
    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });

    const prescription = await prisma.prescription.create({
      data: {
        patientId: parseInt(patientId), doctorId: doctor.id,
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        diagnosisNotes, instructions,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        items: {
          create: items.map(item => ({
            medicationId: parseInt(item.medicationId),
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          })),
        },
      },
      include: { items: { include: { medication: true } }, patient: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    // Notify patient
    const patient = await prisma.patient.findUnique({ where: { id: parseInt(patientId) } });
    await prisma.notification.create({
      data: { userId: patient.userId, title: 'New Prescription', message: 'Your doctor has issued a new prescription.', type: 'APPOINTMENT', link: `/patient/prescriptions` },
    });

    res.status(201).json(prescription);
  } catch (error) { next(error); }
});

// GET /api/prescriptions/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        patient: { include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { firstName: true, lastName: true } }, department: true } },
        items: { include: { medication: true } },
      },
    });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found.' });
    res.json(prescription);
  } catch (error) { next(error); }
});

module.exports = router;
