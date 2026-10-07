const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');

// Get all safe remedies for pregnancy
router.get('/remedies', authenticate, async (req, res) => {
  try {
    const remedies = await prisma.homeRemedy.findMany({
      where: { portal: 'PREGNANCY' }
    });
    res.json(remedies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile Management
router.get('/profile', authenticate, async (req, res) => {
  try {
    const profile = await prisma.pregnancyProfile.findUnique({
      where: { motherId: req.user.id }
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/profile', authenticate, async (req, res) => {
  try {
    const profile = await prisma.pregnancyProfile.upsert({
      where: { motherId: req.user.id },
      update: req.body,
      create: { ...req.body, motherId: req.user.id }
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Symptom Logs
router.get('/symptoms', authenticate, async (req, res) => {
  try {
    const logs = await prisma.pregnancySymptomLog.findMany({
      where: { motherId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/symptoms', authenticate, async (req, res) => {
  try {
    const log = await prisma.pregnancySymptomLog.create({
      data: {
        ...req.body,
        motherId: req.user.id
      }
    });
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
