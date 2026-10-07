const express = require('express');
const prisma = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// GET /api/feedback
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { doctorId, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let where = {};
    if (doctorId) where.doctorId = parseInt(doctorId);
    if (req.user.role.name === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
      where.patientId = patient.id;
    }
    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where, include: {
          patient: { include: { user: { select: { firstName: true, lastName: true } } } },
          doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
        skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
      }),
      prisma.feedback.count({ where }),
    ]);
    res.json({ data: feedback, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// POST /api/feedback
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { doctorId, rating, comment, category, isAnonymous } = req.body;
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
    if (!patient) return res.status(400).json({ error: 'Only patients can submit feedback.' });
    const fb = await prisma.feedback.create({
      data: { patientId: patient.id, doctorId: doctorId ? parseInt(doctorId) : null, rating: parseInt(rating), comment, category, isAnonymous: isAnonymous || false },
    });
    res.status(201).json(fb);
  } catch (error) { next(error); }
});

module.exports = router;
