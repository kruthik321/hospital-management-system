const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');

// Get all home remedies for kids
router.get('/remedies', authenticate, async (req, res) => {
  try {
    const remedies = await prisma.homeRemedy.findMany({
      where: { portal: 'KIDS' }
    });
    res.json(remedies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile Management
router.get('/profiles', authenticate, async (req, res) => {
  try {
    const profiles = await prisma.kidProfile.findMany({
      where: { parentId: req.user.id }
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/profiles', authenticate, async (req, res) => {
  try {
    const profile = await prisma.kidProfile.create({
      data: {
        ...req.body,
        parentId: req.user.id
      }
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vaccinations
router.get('/vaccinations', authenticate, async (req, res) => {
  try {
    const vaccines = await prisma.vaccination.findMany();
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my-vaccinations/:kidId', authenticate, async (req, res) => {
  try {
    const records = await prisma.kidVaccination.findMany({
      where: { kidId: parseInt(req.params.kidId) },
      include: { vaccination: true }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
