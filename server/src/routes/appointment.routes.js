const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/appointments
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, date, doctorId, patientId } = req.query;
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
    if (doctorId) where.doctorId = parseInt(doctorId);
    if (patientId) where.patientId = parseInt(patientId);
    if (date) where.appointmentDate = { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) };

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: { include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } } },
          doctor: { include: { user: { select: { firstName: true, lastName: true } }, department: { select: { name: true } } } },
        },
        skip, take: parseInt(limit), orderBy: { appointmentDate: 'desc' },
      }),
      prisma.appointment.count({ where }),
    ]);
    res.json({ data: appointments, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// POST /api/appointments
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDate, timeSlot, type, reason } = req.body;

    let pId = patientId;
    if (req.user.role.name === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
      pId = patient.id;
    }

    // Check for conflicting appointments
    const existing = await prisma.appointment.findFirst({
      where: { doctorId: parseInt(doctorId), appointmentDate: new Date(appointmentDate), timeSlot, status: { notIn: ['CANCELLED'] } },
    });
    if (existing) return res.status(400).json({ error: 'This time slot is already booked.' });

    const appointment = await prisma.appointment.create({
      data: { patientId: parseInt(pId), doctorId: parseInt(doctorId), appointmentDate: new Date(appointmentDate), timeSlot, type: type || 'CONSULTATION', reason },
      include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } }, doctor: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    // Create notification for doctor
    const doctor = await prisma.doctor.findUnique({ where: { id: parseInt(doctorId) } });
    await prisma.notification.create({
      data: { userId: doctor.userId, title: 'New Appointment', message: `New appointment scheduled for ${new Date(appointmentDate).toLocaleDateString()} at ${timeSlot}`, type: 'APPOINTMENT' },
    });

    res.status(201).json(appointment);
  } catch (error) { next(error); }
});

// PUT /api/appointments/:id
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { status, appointmentDate, timeSlot, notes } = req.body;
    const appointment = await prisma.appointment.update({
      where: { id: parseInt(req.params.id) },
      data: { ...(status && { status }), ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }), ...(timeSlot && { timeSlot }), ...(notes && { notes }) },
      include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } }, doctor: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });
    res.json(appointment);
  } catch (error) { next(error); }
});

// DELETE /api/appointments/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await prisma.appointment.update({ where: { id: parseInt(req.params.id) }, data: { status: 'CANCELLED' } });
    res.json({ message: 'Appointment cancelled.' });
  } catch (error) { next(error); }
});

module.exports = router;
