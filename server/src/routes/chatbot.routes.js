const express = require('express');
const prisma = require('../config/db');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// POST /api/chatbot/query
router.post('/query', authenticate, async (req, res, next) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();

    // Intent detection based on keywords
    let response = '';
    let suggestions = [];

    // Appointment related
    if (lowerMsg.includes('appointment') || lowerMsg.includes('book') || lowerMsg.includes('schedule')) {
      if (lowerMsg.includes('how') || lowerMsg.includes('book')) {
        response = '📅 **Booking an Appointment:**\n\n1. Go to "Book Appointment" from your dashboard\n2. Select a department and doctor\n3. Choose an available date and time slot\n4. Add a reason for your visit\n5. Click "Book Appointment"\n\nYour doctor will be notified automatically!';
      } else if (lowerMsg.includes('cancel')) {
        response = '❌ **Cancelling an Appointment:**\n\nGo to "My Appointments" → find the appointment → click "Cancel". Note: Please cancel at least 24 hours in advance.';
      } else {
        response = '📅 I can help with appointments! Would you like to know how to:\n- Book a new appointment\n- Cancel an appointment\n- View upcoming appointments';
        suggestions = ['How to book appointment?', 'Cancel appointment', 'View my appointments'];
      }
    }
    // Prescription related
    else if (lowerMsg.includes('prescription') || lowerMsg.includes('medicine') || lowerMsg.includes('medication')) {
      response = '💊 **Your Prescriptions:**\n\nYou can view all your prescriptions at "My Prescriptions" on your dashboard. Each prescription includes:\n- Prescribed medicines with dosage\n- Doctor\'s instructions\n- Follow-up date if applicable';
      suggestions = ['View prescriptions', 'Download prescription'];
    }
    // Report/Lab related
    else if (lowerMsg.includes('report') || lowerMsg.includes('lab') || lowerMsg.includes('test') || lowerMsg.includes('download')) {
      response = '📋 **Lab Reports:**\n\nView your lab reports at "My Reports" on your dashboard. Reports are uploaded once your tests are completed. You can download them as PDF.';
      suggestions = ['View reports', 'Download reports'];
    }
    // Billing related
    else if (lowerMsg.includes('bill') || lowerMsg.includes('pay') || lowerMsg.includes('charge') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
      response = '💰 **Billing Information:**\n\nView all your bills at "My Billing" on your dashboard. You can:\n- View itemized bills\n- Make payments online\n- Download invoices\n- Check payment history';
      suggestions = ['View bills', 'Payment methods', 'Insurance coverage'];
    }
    // Doctor related
    else if (lowerMsg.includes('doctor') || lowerMsg.includes('specialist') || lowerMsg.includes('consult') || lowerMsg.includes('which doctor')) {
      response = '👨‍⚕️ **Finding a Doctor:**\n\nUse our **Symptom Checker** to get AI-powered doctor recommendations based on your symptoms. You can also browse doctors by department from the "Book Appointment" page.';
      suggestions = ['Use Symptom Checker', 'Browse doctors', 'Book appointment'];
    }
    // Emergency
    else if (lowerMsg.includes('emergency') || lowerMsg.includes('urgent') || lowerMsg.includes('critical')) {
      response = '🚨 **Emergency:**\n\nFor medical emergencies, please call our emergency helpline immediately: **108** or visit the nearest emergency department.\n\nDo NOT rely on online consultations for emergencies.';
    }
    // Greeting
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || lowerMsg.includes('help')) {
      response = '👋 **Hello! I\'m your Healthcare Assistant.**\n\nI can help you with:\n- 📅 Booking appointments\n- 💊 Viewing prescriptions\n- 📋 Downloading reports\n- 💰 Billing queries\n- 👨‍⚕️ Finding doctors\n- 🔍 Checking symptoms\n\nWhat would you like help with?';
      suggestions = ['Book appointment', 'View prescriptions', 'Check symptoms', 'Billing help'];
    }
    // Try FAQ search
    else {
      const faqs = await prisma.fAQ.findMany({
        where: {
          isActive: true,
          OR: [
            { question: { contains: message, mode: 'insensitive' } },
            { keywords: { contains: message.split(' ')[0], mode: 'insensitive' } },
            { answer: { contains: message, mode: 'insensitive' } },
          ],
        },
        take: 3,
      });

      if (faqs.length > 0) {
        response = '📚 **Here\'s what I found:**\n\n' + faqs.map((faq, i) => `**Q: ${faq.question}**\n${faq.answer}`).join('\n\n---\n\n');
      } else {
        response = '🤔 I\'m not sure about that. Here are some things I can help with:\n\n- 📅 Appointments\n- 💊 Prescriptions & Medicines\n- 📋 Lab Reports\n- 💰 Billing & Payments\n- 👨‍⚕️ Finding Doctors\n- 🔍 Symptom Checking\n\nPlease try rephrasing your question!';
        suggestions = ['Book appointment', 'View prescriptions', 'Check symptoms', 'Contact support'];
      }
    }

    res.json({ response, suggestions, timestamp: new Date().toISOString() });
  } catch (error) { next(error); }
});

module.exports = router;
