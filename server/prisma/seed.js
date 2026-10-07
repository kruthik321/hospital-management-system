const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Roles
  const roles = ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName.charAt(0) + roleName.slice(1).toLowerCase()} role` },
    });
  }
  console.log('✅ Roles created');

  // Create Departments
  const departments = [
    { name: 'Cardiology', description: 'Heart and cardiovascular system', floor: '2nd Floor' },
    { name: 'Neurology', description: 'Brain and nervous system', floor: '3rd Floor' },
    { name: 'Orthopedics', description: 'Bones, joints, and muscles', floor: '2nd Floor' },
    { name: 'Pediatrics', description: 'Child healthcare', floor: '1st Floor' },
    { name: 'Dermatology', description: 'Skin disorders', floor: '1st Floor' },
    { name: 'General Medicine', description: 'General healthcare services', floor: 'Ground Floor' },
    { name: 'Ophthalmology', description: 'Eye care', floor: '3rd Floor' },
    { name: 'ENT', description: 'Ear, Nose, and Throat', floor: '2nd Floor' },
    { name: 'Gynecology', description: 'Women\'s health', floor: '4th Floor' },
    { name: 'Oncology', description: 'Cancer treatment', floor: '4th Floor' },
    { name: 'Radiology', description: 'Medical imaging', floor: 'Ground Floor' },
    { name: 'Pathology', description: 'Lab diagnostics', floor: 'Ground Floor' },
    { name: 'Psychiatry', description: 'Mental health', floor: '3rd Floor' },
    { name: 'Emergency Medicine', description: 'Emergency care', floor: 'Ground Floor' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
  }
  console.log('✅ Departments created');

  // Create default Admin user
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      email: 'admin@hospital.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '9876543210',
      roleId: adminRole.id,
      staff: { create: { designation: 'System Administrator' } },
    },
  });
  console.log('✅ Admin user created (admin@hospital.com / Admin@123)');

  // Seed Symptom-Disease mappings for AI Symptom Checker
  const symptomMappings = [
    { symptom: 'fever', disease: 'Flu (Influenza)', specialization: 'General Medicine', probability: 0.7, description: 'Common viral infection causing fever, body aches, and fatigue' },
    { symptom: 'cough', disease: 'Flu (Influenza)', specialization: 'General Medicine', probability: 0.6 },
    { symptom: 'headache', disease: 'Flu (Influenza)', specialization: 'General Medicine', probability: 0.5 },
    { symptom: 'fever', disease: 'COVID-19', specialization: 'General Medicine', probability: 0.6, description: 'Respiratory illness caused by SARS-CoV-2' },
    { symptom: 'cough', disease: 'COVID-19', specialization: 'General Medicine', probability: 0.7 },
    { symptom: 'shortness of breath', disease: 'COVID-19', specialization: 'General Medicine', probability: 0.8 },
    { symptom: 'loss of taste', disease: 'COVID-19', specialization: 'General Medicine', probability: 0.9 },
    { symptom: 'chest pain', disease: 'Angina', specialization: 'Cardiology', probability: 0.7, description: 'Chest pain caused by reduced blood flow to the heart' },
    { symptom: 'shortness of breath', disease: 'Angina', specialization: 'Cardiology', probability: 0.6 },
    { symptom: 'dizziness', disease: 'Angina', specialization: 'Cardiology', probability: 0.4 },
    { symptom: 'headache', disease: 'Migraine', specialization: 'Neurology', probability: 0.8, description: 'Severe, recurring headache, often with nausea and light sensitivity' },
    { symptom: 'nausea', disease: 'Migraine', specialization: 'Neurology', probability: 0.5 },
    { symptom: 'blurred vision', disease: 'Migraine', specialization: 'Neurology', probability: 0.6 },
    { symptom: 'joint pain', disease: 'Arthritis', specialization: 'Orthopedics', probability: 0.8, description: 'Inflammation of joints causing pain and stiffness' },
    { symptom: 'swelling', disease: 'Arthritis', specialization: 'Orthopedics', probability: 0.7 },
    { symptom: 'stiffness', disease: 'Arthritis', specialization: 'Orthopedics', probability: 0.7 },
    { symptom: 'rash', disease: 'Eczema', specialization: 'Dermatology', probability: 0.7, description: 'Skin condition causing itchy, inflamed patches' },
    { symptom: 'itching', disease: 'Eczema', specialization: 'Dermatology', probability: 0.8 },
    { symptom: 'dry skin', disease: 'Eczema', specialization: 'Dermatology', probability: 0.6 },
    { symptom: 'stomach pain', disease: 'Gastritis', specialization: 'General Medicine', probability: 0.7, description: 'Inflammation of the stomach lining' },
    { symptom: 'nausea', disease: 'Gastritis', specialization: 'General Medicine', probability: 0.6 },
    { symptom: 'vomiting', disease: 'Gastritis', specialization: 'General Medicine', probability: 0.5 },
    { symptom: 'fever', disease: 'Dengue', specialization: 'General Medicine', probability: 0.6, description: 'Mosquito-borne viral infection' },
    { symptom: 'body ache', disease: 'Dengue', specialization: 'General Medicine', probability: 0.7 },
    { symptom: 'rash', disease: 'Dengue', specialization: 'General Medicine', probability: 0.5 },
    { symptom: 'sore throat', disease: 'Tonsillitis', specialization: 'ENT', probability: 0.8, description: 'Inflammation of the tonsils' },
    { symptom: 'fever', disease: 'Tonsillitis', specialization: 'ENT', probability: 0.5 },
    { symptom: 'difficulty swallowing', disease: 'Tonsillitis', specialization: 'ENT', probability: 0.7 },
    { symptom: 'eye pain', disease: 'Conjunctivitis', specialization: 'Ophthalmology', probability: 0.7, description: 'Eye infection causing redness and discharge' },
    { symptom: 'eye redness', disease: 'Conjunctivitis', specialization: 'Ophthalmology', probability: 0.9 },
    { symptom: 'watery eyes', disease: 'Conjunctivitis', specialization: 'Ophthalmology', probability: 0.6 },
    { symptom: 'anxiety', disease: 'Generalized Anxiety Disorder', specialization: 'Psychiatry', probability: 0.7, description: 'Persistent excessive worry and anxiety' },
    { symptom: 'insomnia', disease: 'Generalized Anxiety Disorder', specialization: 'Psychiatry', probability: 0.6 },
    { symptom: 'restlessness', disease: 'Generalized Anxiety Disorder', specialization: 'Psychiatry', probability: 0.7 },
    { symptom: 'fatigue', disease: 'Anemia', specialization: 'General Medicine', probability: 0.7, description: 'Low red blood cell count causing tiredness' },
    { symptom: 'dizziness', disease: 'Anemia', specialization: 'General Medicine', probability: 0.6 },
    { symptom: 'pale skin', disease: 'Anemia', specialization: 'General Medicine', probability: 0.8 },
  ];

  for (const mapping of symptomMappings) {
    await prisma.symptomDiseaseMap.create({ data: mapping });
  }
  console.log('✅ Symptom-disease mappings created');

  // Seed FAQ entries
  const faqEntries = [
    { question: 'How do I book an appointment?', answer: 'Login to your patient dashboard, click "Book Appointment", select a doctor and available time slot, then confirm your booking.', category: 'APPOINTMENT', keywords: 'book,appointment,schedule,visit', sortOrder: 1 },
    { question: 'How do I cancel an appointment?', answer: 'Go to "My Appointments" in your dashboard, find the appointment and click "Cancel". We recommend cancelling at least 24 hours before the scheduled time.', category: 'APPOINTMENT', keywords: 'cancel,appointment,reschedule', sortOrder: 2 },
    { question: 'How do I view my prescriptions?', answer: 'Navigate to "My Prescriptions" from your patient dashboard. You can view all current and past prescriptions along with dosage instructions.', category: 'GENERAL', keywords: 'prescription,medicine,view,medication', sortOrder: 3 },
    { question: 'How can I download my lab reports?', answer: 'Go to "My Reports" in your dashboard. Completed lab reports will appear there. Click the download icon to save them as PDF.', category: 'LAB', keywords: 'report,lab,download,test,result', sortOrder: 4 },
    { question: 'What payment methods are accepted?', answer: 'We accept Cash, Credit/Debit Cards, UPI payments, and Insurance claims. Visit the billing section for more details.', category: 'BILLING', keywords: 'payment,pay,bill,card,upi,cash,insurance', sortOrder: 5 },
    { question: 'How do I contact emergency services?', answer: 'For emergencies, call our emergency helpline at 108 or visit our Emergency department on the Ground Floor. Available 24/7.', category: 'GENERAL', keywords: 'emergency,urgent,help,critical,ambulance', sortOrder: 6 },
    { question: 'Can I get a second opinion?', answer: 'Yes, you can book an appointment with another doctor in the same or different department for a second opinion.', category: 'GENERAL', keywords: 'second opinion,another doctor,review', sortOrder: 7 },
    { question: 'How does insurance claim work?', answer: 'Add your insurance details in your profile. During billing, select "Insurance" as payment method. Our team will process the claim with your provider.', category: 'BILLING', keywords: 'insurance,claim,coverage,policy', sortOrder: 8 },
    { question: 'What are visiting hours?', answer: 'General visiting hours are 10:00 AM to 12:00 PM and 4:00 PM to 6:00 PM. ICU visiting is limited to 15 minutes per visit.', category: 'GENERAL', keywords: 'visiting,hours,visit,time,ward', sortOrder: 9 },
    { question: 'How do I update my profile?', answer: 'Click on your avatar in the top-right corner, select "Profile", and update your personal information, contact details, and emergency contacts.', category: 'GENERAL', keywords: 'profile,update,edit,personal,details', sortOrder: 10 },
  ];

  for (const faq of faqEntries) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✅ FAQ entries created');

  // Seed some lab test types
  const labTests = [
    { name: 'Complete Blood Count (CBC)', category: 'Hematology', cost: 500, normalRange: 'Various', description: 'Measures different components of blood' },
    { name: 'Blood Sugar (Fasting)', category: 'Biochemistry', cost: 200, normalRange: '70-100 mg/dL', unit: 'mg/dL' },
    { name: 'Blood Sugar (PP)', category: 'Biochemistry', cost: 200, normalRange: '<140 mg/dL', unit: 'mg/dL' },
    { name: 'Lipid Profile', category: 'Biochemistry', cost: 800, normalRange: 'Various', description: 'Measures cholesterol and triglycerides' },
    { name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', cost: 1200, normalRange: 'Various' },
    { name: 'Liver Function Test (LFT)', category: 'Biochemistry', cost: 900, normalRange: 'Various' },
    { name: 'Kidney Function Test (KFT)', category: 'Biochemistry', cost: 800, normalRange: 'Various' },
    { name: 'Urine Routine', category: 'Pathology', cost: 300, normalRange: 'Various' },
    { name: 'Chest X-Ray', category: 'Radiology', cost: 600, description: 'X-ray imaging of the chest' },
    { name: 'ECG', category: 'Cardiology', cost: 500, description: 'Electrocardiogram' },
    { name: 'MRI Brain', category: 'Radiology', cost: 8000, description: 'Magnetic Resonance Imaging of brain' },
    { name: 'CT Scan', category: 'Radiology', cost: 5000, description: 'Computed Tomography scan' },
    { name: 'Ultrasound Abdomen', category: 'Radiology', cost: 1500, description: 'Ultrasound imaging of abdomen' },
    { name: 'HbA1c', category: 'Biochemistry', cost: 600, normalRange: '<5.7%', unit: '%', description: 'Average blood sugar over 3 months' },
    { name: 'Vitamin D', category: 'Biochemistry', cost: 1000, normalRange: '30-100 ng/mL', unit: 'ng/mL' },
  ];

  for (const test of labTests) {
    await prisma.labTest.create({ data: test });
  }
  console.log('✅ Lab tests created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin login: admin@hospital.com / Admin@123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
