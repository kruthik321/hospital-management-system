const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/pharmacy/medications
router.get('/medications', authenticate, async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const where = { isActive: true, ...(search && { name: { contains: search, mode: 'insensitive' } }), ...(category && { category }) };
    const medications = await prisma.medication.findMany({ where, orderBy: { name: 'asc' } });
    res.json(medications);
  } catch (error) { next(error); }
});

// POST /api/pharmacy/medications
router.post('/medications', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const med = await prisma.medication.create({ data: { ...req.body, price: parseFloat(req.body.price) || 0 } });
    res.status(201).json(med);
  } catch (error) { next(error); }
});

// PUT /api/pharmacy/medications/:id
router.put('/medications/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const med = await prisma.medication.update({ where: { id: parseInt(req.params.id) }, data: { ...req.body, price: req.body.price ? parseFloat(req.body.price) : undefined } });
    res.json(med);
  } catch (error) { next(error); }
});

// GET /api/pharmacy/inventory
router.get('/inventory', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, lowStock } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let where = {};
    if (category) where.category = category;
    if (lowStock === 'true') where.quantity = { lte: prisma.inventory.fields?.reorderLevel || 10 };
    const [items, total] = await Promise.all([
      prisma.inventory.findMany({ where, include: { medication: true }, skip, take: parseInt(limit), orderBy: { itemName: 'asc' } }),
      prisma.inventory.count({ where }),
    ]);
    res.json({ data: items, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
});

// POST /api/pharmacy/inventory
router.post('/inventory', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await prisma.inventory.create({
      data: { ...req.body, medicationId: req.body.medicationId ? parseInt(req.body.medicationId) : null, quantity: parseInt(req.body.quantity) || 0, reorderLevel: parseInt(req.body.reorderLevel) || 10, costPerUnit: parseFloat(req.body.costPerUnit) || 0, expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null },
    });
    res.status(201).json(item);
  } catch (error) { next(error); }
});

// PUT /api/pharmacy/inventory/:id
router.put('/inventory/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const item = await prisma.inventory.update({ where: { id: parseInt(req.params.id) }, data: { ...req.body, quantity: req.body.quantity ? parseInt(req.body.quantity) : undefined, costPerUnit: req.body.costPerUnit ? parseFloat(req.body.costPerUnit) : undefined, expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined } });
    res.json(item);
  } catch (error) { next(error); }
});

// POST /api/pharmacy/orders
router.post('/orders', authenticate, authorize('ADMIN', 'DOCTOR'), async (req, res, next) => {
  try {
    const order = await prisma.pharmacyOrder.create({
      data: { prescriptionId: parseInt(req.body.prescriptionId), totalCost: parseFloat(req.body.totalCost) || 0, notes: req.body.notes },
      include: { prescription: { include: { items: { include: { medication: true } } } } },
    });
    res.status(201).json(order);
  } catch (error) { next(error); }
});

// PUT /api/pharmacy/orders/:id/dispense
router.put('/orders/:id/dispense', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const order = await prisma.pharmacyOrder.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'DISPENSED', dispensedBy: `${req.user.firstName} ${req.user.lastName}`, dispensedAt: new Date() },
    });
    res.json(order);
  } catch (error) { next(error); }
});

module.exports = router;
