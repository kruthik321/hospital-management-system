require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const nurseRoutes = require('./routes/nurse.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const labRoutes = require('./routes/lab.routes');
const pharmacyRoutes = require('./routes/pharmacy.routes');
const roomRoutes = require('./routes/room.routes');
const billingRoutes = require('./routes/billing.routes');
const adminRoutes = require('./routes/admin.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const faqRoutes = require('./routes/faq.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const aiRoutes = require('./routes/ai.routes');
const notificationRoutes = require('./routes/notification.routes');
const kidsRoutes = require('./routes/kids.routes');
const pregnancyRoutes = require('./routes/pregnancy.routes');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true })); // Allow all origins for Localtunnel
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/nurses', nurseRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/kids', kidsRoutes);
app.use('/api/pregnancy', pregnancyRoutes);

// Serve Frontend
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// React Router Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🏥 HMS Server running on http://localhost:${PORT}`);
});

module.exports = app;
