const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const [totalPatients, totalDoctors, totalNurses, totalAppointments, todayAppointments, pendingBills, revenue, recentAppointments, lowStockItems, departmentStats] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.nurse.count(),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { appointmentDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)), lt: new Date(new Date().setHours(23, 59, 59, 999)) } } }),
      prisma.billing.count({ where: { status: 'PENDING' } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.appointment.findMany({
        include: { patient: { include: { user: { select: { firstName: true, lastName: true } } } }, doctor: { include: { user: { select: { firstName: true, lastName: true } } } } },
        orderBy: { createdAt: 'desc' }, take: 5,
      }),
      prisma.inventory.findMany({ where: { quantity: { lte: 10 } }, take: 10, orderBy: { quantity: 'asc' } }),
      prisma.department.findMany({ include: { _count: { select: { doctors: true, rooms: true } } } }),
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyPayments = await prisma.payment.findMany({ where: { paidAt: { gte: sixMonthsAgo } }, select: { amount: true, paidAt: true } });

    const monthlyRevenue = {};
    monthlyPayments.forEach(p => {
      const key = `${p.paidAt.getFullYear()}-${String(p.paidAt.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + p.amount;
    });

    // Appointment status distribution
    const appointmentStats = await prisma.appointment.groupBy({ by: ['status'], _count: { status: true } });

    res.json({
      stats: { totalPatients, totalDoctors, totalNurses, totalAppointments, todayAppointments, pendingBills, totalRevenue: revenue._sum.amount || 0 },
      recentAppointments, lowStockItems, departmentStats, monthlyRevenue, appointmentStats,
    });
  } catch (error) { next(error); }
});

// GET /api/admin/users
router.get('/users', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let where = {};
    if (role) where.role = { name: role };
    if (search) where.OR = [{ firstName: { contains: search, mode: 'insensitive' } }, { lastName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }];
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, include: { role: true }, select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true, role: true, createdAt: true }, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    res.json({ data: users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// PUT /api/admin/users/:id/toggle-status
router.put('/users/:id/toggle-status', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    const updated = await prisma.user.update({ where: { id: parseInt(req.params.id) }, data: { isActive: !user.isActive }, include: { role: true } });
    res.json(updated);
  } catch (error) { next(error); }
});

// GET /api/admin/departments
router.get('/departments', authenticate, async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({ include: { _count: { select: { doctors: true, nurses: true, rooms: true } } }, orderBy: { name: 'asc' } });
    res.json(departments);
  } catch (error) { next(error); }
});

// POST /api/admin/departments
router.post('/departments', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const dept = await prisma.department.create({ data: req.body });
    res.status(201).json(dept);
  } catch (error) { next(error); }
});

// PUT /api/admin/departments/:id
router.put('/departments/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const dept = await prisma.department.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(dept);
  } catch (error) { next(error); }
});

// DELETE /api/admin/departments/:id
router.delete('/departments/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await prisma.department.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Department deleted.' });
  } catch (error) { next(error); }
});

// GET /api/admin/equipment
router.get('/equipment', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const equipment = await prisma.equipment.findMany({ orderBy: { name: 'asc' } });
    res.json(equipment);
  } catch (error) { next(error); }
});

// POST /api/admin/equipment
router.post('/equipment', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const eq = await prisma.equipment.create({
      data: { ...req.body, cost: parseFloat(req.body.cost) || 0, purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : null, warrantyExpiry: req.body.warrantyExpiry ? new Date(req.body.warrantyExpiry) : null },
    });
    res.status(201).json(eq);
  } catch (error) { next(error); }
});

module.exports = router;
