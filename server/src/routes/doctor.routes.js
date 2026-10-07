const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/doctors
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', department, specialization } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      AND: [
        search ? {
          OR: [
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { user: { lastName: { contains: search, mode: 'insensitive' } } },
            { specialization: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        department ? { departmentId: parseInt(department) } : {},
        specialization ? { specialization: { contains: specialization, mode: 'insensitive' } } : {},
      ],
    };

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true, avatar: true } },
          department: { select: { id: true, name: true } },
          schedules: true,
          _count: { select: { appointments: true, feedback: true } },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.doctor.count({ where }),
    ]);

    // Calculate average rating for each doctor
    const doctorsWithRating = await Promise.all(doctors.map(async (doctor) => {
      const avgRating = await prisma.feedback.aggregate({
        where: { doctorId: doctor.id },
        _avg: { rating: true },
      });
      return { ...doctor, avgRating: avgRating._avg.rating || 0 };
    }));

    res.json({ data: doctorsWithRating, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
});

// GET /api/doctors/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } },
        department: true,
        schedules: true,
        feedback: { include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } } }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found.' });

    const avgRating = await prisma.feedback.aggregate({ where: { doctorId: doctor.id }, _avg: { rating: true } });
    res.json({ ...doctor, avgRating: avgRating._avg.rating || 0 });
  } catch (error) {
    next(error);
  }
});

// POST /api/doctors
router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone, departmentId, specialization, qualification, experience, consultationFee, licenseNumber, bio } = req.body;

    const role = await prisma.role.findUnique({ where: { name: 'DOCTOR' } });
    const hashedPassword = await bcrypt.hash(password || 'Doctor@123', 12);

    const user = await prisma.user.create({
      data: {
        email, password: hashedPassword, firstName, lastName, phone, roleId: role.id,
        doctor: {
          create: { departmentId: departmentId ? parseInt(departmentId) : null, specialization, qualification, experience: experience ? parseInt(experience) : null, consultationFee: consultationFee ? parseFloat(consultationFee) : null, licenseNumber, bio },
        },
      },
      include: { doctor: { include: { department: true } }, role: true },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// PUT /api/doctors/:id
router.put('/:id', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
  try {
    const { departmentId, specialization, qualification, experience, consultationFee, licenseNumber, bio } = req.body;
    const doctor = await prisma.doctor.update({
      where: { id: parseInt(req.params.id) },
      data: { departmentId: departmentId ? parseInt(departmentId) : undefined, specialization, qualification, experience: experience ? parseInt(experience) : undefined, consultationFee: consultationFee ? parseFloat(consultationFee) : undefined, licenseNumber, bio },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } }, department: true },
    });
    res.json(doctor);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/doctors/:id
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found.' });
    await prisma.user.delete({ where: { id: doctor.userId } });
    res.json({ message: 'Doctor deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// POST /api/doctors/:id/schedule
router.post('/:id/schedule', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
  try {
    const { dayOfWeek, startTime, endTime, slotDuration } = req.body;
    const schedule = await prisma.doctorSchedule.create({
      data: { doctorId: parseInt(req.params.id), dayOfWeek, startTime, endTime, slotDuration: slotDuration || 30 },
    });
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
});

// GET /api/doctors/:id/appointments
router.get('/:id/appointments', authenticate, async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const where = {
      doctorId: parseInt(req.params.id),
      ...(date && { appointmentDate: { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) } }),
      ...(status && { status }),
    };
    const appointments = await prisma.appointment.findMany({
      where,
      include: { patient: { include: { user: { select: { firstName: true, lastName: true, phone: true, email: true } } } } },
      orderBy: { appointmentDate: 'asc' },
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
