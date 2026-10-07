const express = require('express');
const prisma = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/faq
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let where = { isActive: true };
    if (category) where.category = category;
    if (search) where.OR = [{ question: { contains: search, mode: 'insensitive' } }, { answer: { contains: search, mode: 'insensitive' } }, { keywords: { contains: search, mode: 'insensitive' } }];
    const faqs = await prisma.fAQ.findMany({ where, orderBy: { sortOrder: 'asc' } });
    res.json(faqs);
  } catch (error) { next(error); }
});

// POST /api/faq
router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const faq = await prisma.fAQ.create({ data: req.body });
    res.status(201).json(faq);
  } catch (error) { next(error); }
});

// PUT /api/faq/:id
router.put('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const faq = await prisma.fAQ.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(faq);
  } catch (error) { next(error); }
});

// DELETE /api/faq/:id
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await prisma.fAQ.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'FAQ deleted.' });
  } catch (error) { next(error); }
});

module.exports = router;
