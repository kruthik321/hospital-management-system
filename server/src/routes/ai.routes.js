const express = require('express');
const prisma = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// POST /api/ai/symptom-check
router.post('/symptom-check', authenticate, async (req, res, next) => {
  try {
    const { symptoms } = req.body; // array of symptom strings
    if (!symptoms || !symptoms.length) {
      return res.status(400).json({ error: 'Please provide at least one symptom.' });
    }

    // Search symptom-disease mappings
    const mappings = await prisma.symptomDiseaseMap.findMany({
      where: {
        symptom: { in: symptoms.map(s => s.toLowerCase()) },
      },
    });

    // Aggregate diseases by match count and probability
    const diseaseScores = {};
    mappings.forEach(mapping => {
      if (!diseaseScores[mapping.disease]) {
        diseaseScores[mapping.disease] = { disease: mapping.disease, specialization: mapping.specialization, matchCount: 0, totalProbability: 0, description: mapping.description };
      }
      diseaseScores[mapping.disease].matchCount++;
      diseaseScores[mapping.disease].totalProbability += mapping.probability;
    });

    // Sort by match count then probability
    const results = Object.values(diseaseScores)
      .sort((a, b) => b.matchCount - a.matchCount || b.totalProbability - a.totalProbability)
      .slice(0, 5)
      .map(r => ({
        disease: r.disease,
        specialization: r.specialization,
        confidence: Math.min(Math.round((r.totalProbability / symptoms.length) * 100), 95),
        description: r.description,
        matchedSymptoms: r.matchCount,
      }));

    // Get recommended doctors based on specializations
    const specializations = [...new Set(results.map(r => r.specialization))];
    const recommendedDoctors = await prisma.doctor.findMany({
      where: { specialization: { in: specializations }, user: { isActive: true } },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        department: { select: { name: true } },
        schedules: { where: { isActive: true } },
      },
      take: 5,
    });

    // Add ratings
    const doctorsWithRating = await Promise.all(recommendedDoctors.map(async (doc) => {
      const avgRating = await prisma.feedback.aggregate({ where: { doctorId: doc.id }, _avg: { rating: true } });
      const appointmentCount = await prisma.appointment.count({ where: { doctorId: doc.id, appointmentDate: { gte: new Date() } } });
      return { ...doc, avgRating: avgRating._avg.rating || 0, upcomingAppointments: appointmentCount };
    }));

    // Sort doctors by rating
    doctorsWithRating.sort((a, b) => b.avgRating - a.avgRating);

    res.json({
      symptoms,
      possibleConditions: results,
      recommendedDoctors: doctorsWithRating,
      disclaimer: 'This is an AI-assisted suggestion and should not replace professional medical advice. Please consult a doctor for accurate diagnosis.',
    });
  } catch (error) { next(error); }
});

// POST /api/ai/recommend-doctor
router.post('/recommend-doctor', authenticate, async (req, res, next) => {
  try {
    const { specialization, date } = req.body;

    let where = { user: { isActive: true } };
    if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        department: { select: { name: true } },
        schedules: { where: { isActive: true } },
        _count: { select: { appointments: true } },
      },
    });

    // Score each doctor
    const scoredDoctors = await Promise.all(doctors.map(async (doc) => {
      const avgRating = await prisma.feedback.aggregate({ where: { doctorId: doc.id }, _avg: { rating: true } });
      const rating = avgRating._avg.rating || 3;

      // Check availability for the requested date
      let isAvailable = true;
      if (date) {
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        isAvailable = doc.schedules.some(s => s.dayOfWeek === dayOfWeek);
      }

      // Calculate a recommendation score
      const score = (rating * 20) + (isAvailable ? 30 : 0) + (doc.experience || 0) - (doc._count.appointments * 0.5);

      return { ...doc, avgRating: rating, isAvailable, recommendationScore: score };
    }));

    scoredDoctors.sort((a, b) => b.recommendationScore - a.recommendationScore);

    res.json(scoredDoctors.slice(0, 10));
  } catch (error) { next(error); }
});

module.exports = router;
