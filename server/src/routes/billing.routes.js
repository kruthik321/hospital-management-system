const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/billing
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const role = req.user.role.name;
    let where = {};
    if (role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({ where: { userId: req.user.id } });
      where.patientId = patient.id;
    }
    if (status) where.status = status;
    if (patientId) where.patientId = parseInt(patientId);

    const [bills, total] = await Promise.all([
      prisma.billing.findMany({
        where, include: {
          patient: { include: { user: { select: { firstName: true, lastName: true } } } },
          items: true, payments: true, appointment: true,
        },
        skip, take: parseInt(limit), orderBy: { createdAt: 'desc' },
      }),
      prisma.billing.count({ where }),
    ]);
    res.json({ data: bills, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// POST /api/billing
router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { patientId, appointmentId, items, discount, tax, dueDate } = req.body;
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const netAmount = totalAmount - (parseFloat(discount) || 0) + (parseFloat(tax) || 0);

    const bill = await prisma.billing.create({
      data: {
        patientId: parseInt(patientId),
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        totalAmount, discount: parseFloat(discount) || 0, tax: parseFloat(tax) || 0, netAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
        items: {
          create: items.map(item => ({
            description: item.description, category: item.category,
            quantity: parseInt(item.quantity) || 1,
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: (parseInt(item.quantity) || 1) * parseFloat(item.unitPrice),
          })),
        },
      },
      include: { items: true, patient: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    // Notify patient
    const patient = await prisma.patient.findUnique({ where: { id: parseInt(patientId) } });
    await prisma.notification.create({
      data: { userId: patient.userId, title: 'New Bill Generated', message: `A bill of ₹${netAmount.toFixed(2)} has been generated.`, type: 'BILLING', link: '/patient/billing' },
    });

    res.status(201).json(bill);
  } catch (error) { next(error); }
});

// POST /api/billing/:id/pay
router.post('/:id/pay', authenticate, async (req, res, next) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    const payment = await prisma.payment.create({
      data: { billingId: parseInt(req.params.id), amount: parseFloat(amount), paymentMethod, transactionId },
    });

    // Check if bill is fully paid
    const bill = await prisma.billing.findUnique({ where: { id: parseInt(req.params.id) }, include: { payments: true } });
    const totalPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
    const newStatus = totalPaid >= bill.netAmount ? 'PAID' : 'PARTIAL';
    await prisma.billing.update({ where: { id: parseInt(req.params.id) }, data: { status: newStatus } });

    res.status(201).json(payment);
  } catch (error) { next(error); }
});

// GET /api/billing/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const bill = await prisma.billing.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { patient: { include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } }, insurance: true } }, items: true, payments: true },
    });
    if (!bill) return res.status(404).json({ error: 'Bill not found.' });
    res.json(bill);
  } catch (error) { next(error); }
});

module.exports = router;
