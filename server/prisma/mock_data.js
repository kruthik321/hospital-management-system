const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Injecting mock data for better readability...');

  const roles = await prisma.role.findMany();
  const getRole = (name) => roles.find((r) => r.name === name).id;

  const depts = await prisma.department.findMany();
  if (depts.length === 0) {
    console.log('No departments found. Seed script has not been run completely.');
    return;
  }

  // 1. Create 3 Patients
  const ptPasswords = await bcrypt.hash('Patient@123', 10);
  const patientsData = [
    { firstName: 'John', lastName: 'Doe', email: 'john@example.com', roleId: getRole('PATIENT'), phone: '9876543210' },
    { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', roleId: getRole('PATIENT'), phone: '9876543211' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', roleId: getRole('PATIENT'), phone: '9876543212' },
  ];
  
  const ptUsers = [];
  for (const p of patientsData) {
    const ptUser = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { ...p, password: ptPasswords, avatar: `https://i.pravatar.cc/150?u=${p.email}`, isActive: true },
    });
    ptUsers.push(ptUser);
  }

  const patients = [];
  for (let i = 0; i < 3; i++) {
    const pt = await prisma.patient.upsert({
      where: { userId: ptUsers[i].id },
      update: {},
      create: { userId: ptUsers[i].id, gender: i === 0 || i === 2 ? 'MALE' : 'FEMALE', dateOfBirth: new Date('1990-01-01'), bloodGroup: i===0?'O+':i===1?'A-':'B+', allergies: i===0?'Peanuts':'Dust', address: '123 Main St', city: 'Metropolis', state: 'NY', zipCode: '10001', emergencyContact: 'Jane Doe', emergencyPhone: '9998887776' },
    });
    patients.push(pt);
  }
  console.log('✅ 3 Patients created');

  // 2. Create 3 Doctors
  const docPasswords = await bcrypt.hash('Doctor@123', 10);
  const doctorData = [
    { firstName: 'Sarah', lastName: 'Connor', email: 'sarah.doc@hospital.com', roleId: getRole('DOCTOR'), phone: '1112223330' },
    { firstName: 'Gregory', lastName: 'House', email: 'gregory.doc@hospital.com', roleId: getRole('DOCTOR'), phone: '1112223331' },
    { firstName: 'Martha', lastName: 'Jones', email: 'martha.doc@hospital.com', roleId: getRole('DOCTOR'), phone: '1112223332' },
  ];

  const docUsers = [];
  for (const d of doctorData) {
    const docUser = await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: { ...d, password: docPasswords, avatar: `https://i.pravatar.cc/150?u=${d.email}`, isActive: true },
    });
    docUsers.push(docUser);
  }

  const doctors = [];
  const specializations = ['Cardiologist', 'Neurologist', 'Pediatrician'];
  for (let i = 0; i < 3; i++) {
    const doc = await prisma.doctor.upsert({
      where: { userId: docUsers[i].id },
      update: {},
      create: { userId: docUsers[i].id, departmentId: depts[i % depts.length].id, specialization: specializations[i], experience: 5 + (i*2), consultationFee: 500 + (i*100), qualification: 'MBBS, MD', licenseNumber: `LIC${1000 + i}`, bio: `Expert ${specializations[i]} with years of experience.` },
    });
    doctors.push(doc);
    await prisma.department.update({
      where: { id: depts[i % depts.length].id },
      data: { headOfDept: `Dr. ${doctorData[i].firstName} ${doctorData[i].lastName}` }
    });
  }
  console.log('✅ 3 Doctors created');

  // 3. Create 3 Nurses
  const nursePasswords = await bcrypt.hash('Nurse@123', 10);
  const nurseData = [
    { firstName: 'Clara', lastName: 'Oswald', email: 'clara.nurse@hospital.com', roleId: getRole('NURSE'), phone: '3334445550' },
    { firstName: 'Rory', lastName: 'Williams', email: 'rory.nurse@hospital.com', roleId: getRole('NURSE'), phone: '3334445551' },
    { firstName: 'Amy', lastName: 'Pond', email: 'amy.nurse@hospital.com', roleId: getRole('NURSE'), phone: '3334445552' },
  ];

  for (const n of nurseData) {
    const nUser = await prisma.user.upsert({
      where: { email: n.email },
      update: {},
      create: { ...n, password: nursePasswords, avatar: `https://i.pravatar.cc/150?u=${n.email}`, isActive: true },
    });
    await prisma.nurse.upsert({
      where: { userId: nUser.id },
      update: {},
      create: { userId: nUser.id, departmentId: depts[0].id, shiftType: 'MORNING', qualification: 'BSc Nursing', wardAssignment: 'General Ward A' },
    });
  }
  console.log('✅ 3 Nurses created');

  // 4. Create 3 Rooms & Beds
  for (let i = 1; i <= 3; i++) {
    const roomNumber = `10${i}`;
    let room = await prisma.room.findUnique({ where: { roomNumber } });
    if (!room) {
      room = await prisma.room.create({
        data: { roomNumber, type: i === 1 ? 'ICU' : 'GENERAL', floor: '1st', charges: i === 1 ? 5000 : 1000, departmentId: depts[0].id },
      });
      await prisma.bed.createMany({
        data: [
          { roomId: room.id, bedNumber: `${roomNumber}-A`, isOccupied: false },
          { roomId: room.id, bedNumber: `${roomNumber}-B`, isOccupied: false },
        ]
      });
    }
  }
  console.log('✅ 3 Rooms added');

  // 5. Create 3 Medications & Inventory
  const meds = [
    { name: 'Paracetamol', genericName: 'Acetaminophen', category: 'Antipyretic', dosageForm: 'Tablet', strength: '500mg', price: 10, manufacturer: 'PharmaCorp', description: 'Pain reliever and fever reducer.', sideEffects: 'Nausea, Rash' },
    { name: 'Amoxicillin', genericName: 'Amoxicillin', category: 'Antibiotic', dosageForm: 'Capsule', strength: '250mg', price: 50, manufacturer: 'HealthMakers', description: 'Treats bacterial infections.', sideEffects: 'Diarrhea, Upset stomach' },
    { name: 'Ibuprofen', genericName: 'Ibuprofen', category: 'NSAID', dosageForm: 'Tablet', strength: '400mg', price: 15, manufacturer: 'MediLife', description: 'Anti-inflammatory painkiller.', sideEffects: 'Heartburn, Dizziness' },
    { name: 'Cetirizine', genericName: 'Cetirizine', category: 'Antihistamine', dosageForm: 'Tablet', strength: '10mg', price: 8, manufacturer: 'AllergyCare', description: 'Treats hay fever and allergy symptoms.', sideEffects: 'Drowsiness, Dry mouth' },
    { name: 'Metformin', genericName: 'Metformin', category: 'Antidiabetic', dosageForm: 'Tablet', strength: '500mg', price: 12, manufacturer: 'Diabetech', description: 'Controls high blood sugar.', sideEffects: 'Nausea, Stomach upset' },
    { name: 'Lisinopril', genericName: 'Lisinopril', category: 'Antihypertensive', dosageForm: 'Tablet', strength: '10mg', price: 18, manufacturer: 'HeartHealth', description: 'Treats high blood pressure.', sideEffects: 'Dizziness, Dry cough' },
    { name: 'Omeprazole', genericName: 'Omeprazole', category: 'Antacid', dosageForm: 'Capsule', strength: '20mg', price: 25, manufacturer: 'GastroMed', description: 'Treats GERD and stomach ulcers.', sideEffects: 'Headache, Nausea' }
  ];
  
  const createdMeds = [];
  for (const m of meds) {
    let md = await prisma.medication.findFirst({ where: { name: m.name } });
    if (!md) md = await prisma.medication.create({ data: m });
    createdMeds.push(md);
  }

  const invs = [
    { itemName: 'Paracetamol Batch A', category: 'MEDICINE', quantity: 150, unit: 'Strips', costPerUnit: 8, supplier: 'Global Meds', batchNumber: 'BTA100', expiryDate: new Date('2028-12-31') },
    { itemName: 'Surgical Gloves', category: 'CONSUMABLE', quantity: 500, unit: 'Pairs', costPerUnit: 5, reorderLevel: 1000, supplier: 'MedEquip', batchNumber: 'GLV200', expiryDate: new Date('2030-01-01') },
    { itemName: 'Syringes 5ml', category: 'CONSUMABLE', quantity: 200, unit: 'Pieces', costPerUnit: 12, supplier: 'MedEquip', batchNumber: 'SYR300', expiryDate: new Date('2029-06-15') },
    // Low stock items:
    { itemName: 'Cetirizine 10mg', category: 'MEDICINE', quantity: 5, unit: 'Strips', costPerUnit: 5, reorderLevel: 50, supplier: 'AllergyCare', batchNumber: 'CET101', expiryDate: new Date('2025-10-10') },
    { itemName: 'Metformin 500mg', category: 'MEDICINE', quantity: 2, unit: 'Bottles', costPerUnit: 8, reorderLevel: 20, supplier: 'Diabetech', batchNumber: 'MET202', expiryDate: new Date('2026-05-15') },
    { itemName: 'Oxygen Masks', category: 'CONSUMABLE', quantity: 8, unit: 'Pieces', costPerUnit: 15, reorderLevel: 100, supplier: 'MedEquip', batchNumber: 'OXY405', expiryDate: new Date('2027-11-20') },
    { itemName: 'Lisinopril 10mg', category: 'MEDICINE', quantity: 4, unit: 'Strips', costPerUnit: 12, reorderLevel: 30, supplier: 'HeartHealth', batchNumber: 'LIS303', expiryDate: new Date('2025-12-01') },
    // Normal stock items:
    { itemName: 'Omeprazole 20mg', category: 'MEDICINE', quantity: 120, unit: 'Strips', costPerUnit: 18, reorderLevel: 40, supplier: 'GastroMed', batchNumber: 'OME404', expiryDate: new Date('2026-08-22') }
  ];
  
  for (const inv of invs) {
    let i = await prisma.inventory.findFirst({ where: { itemName: inv.itemName } });
    if (!i) await prisma.inventory.create({ data: inv });
  }
  console.log('✅ 3 Medications & Inventory items added');

  // 6. Create 3 Appointments
  const timeSlots = ['10:00 AM', '11:00 AM', '02:00 PM'];
  const appts = [];
  for (let i = 0; i < 3; i++) {
    const existing = await prisma.appointment.findFirst({ where: { patientId: patients[i].id } });
    if (!existing) {
      const a = await prisma.appointment.create({
        data: { patientId: patients[i].id, doctorId: doctors[i].id, appointmentDate: new Date(), timeSlot: timeSlots[i], status: 'IN_PROGRESS', reason: 'Routine Checkup', type: 'CONSULTATION', notes: 'Patient complained of mild headache.' }
      });
      appts.push(a);
    } else {
      appts.push(existing);
    }
  }
  console.log('✅ 3 Appointments created (IN_PROGRESS)');

  // 7. Create Prescriptions & Billing
  for (let i = 0; i < 3; i++) {
    if (appts[i]) {
      // Check if prescription already exists
      const pCount = await prisma.prescription.count({ where: { appointmentId: appts[i].id } });
      if (pCount === 0) {
        await prisma.prescription.create({
          data: {
            patientId: patients[i].id, doctorId: doctors[i].id, appointmentId: appts[i].id, diagnosisNotes: 'Mild infection, advised rest.', instructions: 'Take meds with food.', followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            items: { create: [{ medicationId: createdMeds[i].id, dosage: '1 tablet', frequency: 'Twice a day', duration: '5 days', instructions: 'Drink plenty of water' }] }
          }
        });
      }
      
      // Create bill
      const bCount = await prisma.billing.count({ where: { appointmentId: appts[i].id } });
      if (bCount === 0) {
        await prisma.billing.create({
          data: {
            patientId: patients[i].id, appointmentId: appts[i].id, totalAmount: 1000, discount: 100, tax: 50, netAmount: 950, status: i===0?'PAID':'PENDING', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            items: { create: [{ description: 'Consultation Fee', category: 'CONSULTATION', quantity: 1, unitPrice: 1000, totalPrice: 1000 }] },
            ...(i === 0 ? { payments: { create: [{ amount: 950, paymentMethod: 'CARD', transactionId: 'TXN123' }] } } : {})
          }
        });
      }
    }
  }
  console.log('✅ Prescriptions and Bills generated');

  // 8. Create Equipment
  const equipments = [
    { name: 'MRI Scanner', category: 'Imaging', model: 'Siemens Magnetom', serialNumber: 'MRI-001', purchaseDate: new Date('2020-01-15'), warrantyExpiry: new Date('2025-01-15'), status: 'WORKING', location: 'Radiology Dept', cost: 1500000, notes: 'Annual maintenance due soon.' },
    { name: 'Ventilator', category: 'Life Support', model: 'Philips Respironics', serialNumber: 'VENT-102', purchaseDate: new Date('2021-06-20'), warrantyExpiry: new Date('2026-06-20'), status: 'WORKING', location: 'ICU', cost: 25000, notes: 'Checked last week.' },
    { name: 'Defibrillator', category: 'Emergency', model: 'Zoll X Series', serialNumber: 'DEF-305', purchaseDate: new Date('2022-11-05'), warrantyExpiry: new Date('2027-11-05'), status: 'MAINTENANCE', location: 'Emergency Room', cost: 12000, notes: 'Sent for battery replacement.' },
    { name: 'ECG Machine', category: 'Cardiology', model: 'GE MAC 2000', serialNumber: 'ECG-004', purchaseDate: new Date('2019-03-10'), warrantyExpiry: new Date('2024-03-10'), status: 'WORKING', location: 'Cardiology Dept', cost: 8000, notes: 'Needs calibration.' },
    { name: 'Ultrasound Machine', category: 'Imaging', model: 'Philips Epiq 7', serialNumber: 'US-005', purchaseDate: new Date('2023-01-12'), warrantyExpiry: new Date('2028-01-12'), status: 'WORKING', location: 'OB/GYN Dept', cost: 85000, notes: 'New unit.' },
    { name: 'Anesthesia Machine', category: 'Surgical', model: 'Drager Perseus', serialNumber: 'ANE-006', purchaseDate: new Date('2020-08-22'), warrantyExpiry: new Date('2025-08-22'), status: 'WORKING', location: 'Operation Theater 1', cost: 65000, notes: 'Working perfectly.' },
    { name: 'Patient Monitor', category: 'Monitoring', model: 'Mindray BeneVision', serialNumber: 'MON-007', purchaseDate: new Date('2022-04-18'), warrantyExpiry: new Date('2027-04-18'), status: 'WORKING', location: 'ICU Bed 1', cost: 4500, notes: 'Software updated.' },
    { name: 'Infusion Pump', category: 'Treatment', model: 'Alaris PC', serialNumber: 'INF-008', purchaseDate: new Date('2021-09-30'), warrantyExpiry: new Date('2026-09-30'), status: 'OUT_OF_ORDER', location: 'General Ward', cost: 2500, notes: 'Display broken, awaiting repair.' },
    { name: 'Surgical Table', category: 'Furniture', model: 'Steris 5085', serialNumber: 'SUR-009', purchaseDate: new Date('2018-02-14'), warrantyExpiry: new Date('2023-02-14'), status: 'WORKING', location: 'Operation Theater 2', cost: 35000, notes: 'Hydraulics serviced recently.' },
    { name: 'Autoclave', category: 'Sterilization', model: 'Steris Amsco', serialNumber: 'AUT-010', purchaseDate: new Date('2019-11-20'), warrantyExpiry: new Date('2024-11-20'), status: 'WORKING', location: 'CSSD', cost: 55000, notes: 'Daily spore tests pass.' },
    { name: 'CT Scanner', category: 'Imaging', model: 'GE Revolution', serialNumber: 'CT-011', purchaseDate: new Date('2022-07-07'), warrantyExpiry: new Date('2027-07-07'), status: 'WORKING', location: 'Radiology Dept', cost: 1200000, notes: 'Very high usage.' },
    { name: 'X-Ray Machine', category: 'Imaging', model: 'Siemens Ysio', serialNumber: 'XR-012', purchaseDate: new Date('2020-05-15'), warrantyExpiry: new Date('2025-05-15'), status: 'MAINTENANCE', location: 'Emergency Room', cost: 95000, notes: 'Tube replacement scheduled.' },
    { name: 'Hemodialysis Machine', category: 'Treatment', model: 'Fresenius 4008S', serialNumber: 'DIA-013', purchaseDate: new Date('2021-12-01'), warrantyExpiry: new Date('2026-12-01'), status: 'WORKING', location: 'Dialysis Unit', cost: 22000, notes: 'Filters changed yesterday.' },
    { name: 'Incubator', category: 'Pediatrics', model: 'GE Giraffe', serialNumber: 'INC-014', purchaseDate: new Date('2023-02-10'), warrantyExpiry: new Date('2028-02-10'), status: 'WORKING', location: 'NICU', cost: 18000, notes: 'Brand new.' },
    { name: 'Blood Gas Analyzer', category: 'Lab', model: 'Radiometer ABL90', serialNumber: 'BGA-015', purchaseDate: new Date('2020-10-05'), warrantyExpiry: new Date('2025-10-05'), status: 'WORKING', location: 'Pathology Lab', cost: 15000, notes: 'Reagents restocked.' },
    { name: 'Centrifuge', category: 'Lab', model: 'Eppendorf 5424', serialNumber: 'CEN-016', purchaseDate: new Date('2019-06-25'), warrantyExpiry: new Date('2024-06-25'), status: 'WORKING', location: 'Pathology Lab', cost: 3500, notes: 'Requires cleaning.' },
    { name: 'Microscope', category: 'Lab', model: 'Olympus CX23', serialNumber: 'MIC-017', purchaseDate: new Date('2018-09-12'), warrantyExpiry: new Date('2023-09-12'), status: 'WORKING', location: 'Pathology Lab', cost: 1200, notes: 'Lenses cleaned.' },
    { name: 'Fetal Monitor', category: 'Monitoring', model: 'Philips Avalon', serialNumber: 'FET-018', purchaseDate: new Date('2021-03-30'), warrantyExpiry: new Date('2026-03-30'), status: 'WORKING', location: 'Maternity Ward', cost: 6500, notes: 'Functional.' },
    { name: 'Endoscopy Tower', category: 'Surgical', model: 'Olympus Visera', serialNumber: 'END-019', purchaseDate: new Date('2022-08-14'), warrantyExpiry: new Date('2027-08-14'), status: 'WORKING', location: 'Gastroenterology', cost: 110000, notes: 'Scopes sterilized.' },
    { name: 'Wheelchair', category: 'Transport', model: 'Invacare 9000', serialNumber: 'WC-020', purchaseDate: new Date('2020-01-01'), warrantyExpiry: new Date('2022-01-01'), status: 'WORKING', location: 'Main Reception', cost: 250, notes: 'Regular wear and tear.' }
  ];
  for (const eq of equipments) {
    let existingEq = await prisma.equipment.findFirst({ where: { serialNumber: eq.serialNumber } });
    if (!existingEq) {
      await prisma.equipment.create({ data: eq });
    }
  }
  console.log(`✅ ${equipments.length} Equipments added`);

  // 9. Create Emergency Cases
  const emergencies = [
    { patientId: patients[0].id, description: 'Severe chest pain, suspected myocardial infarction.', severity: 'CRITICAL', status: 'ACTIVE', assignedTo: `Dr. ${doctorData[0].firstName} ${doctorData[0].lastName}`, notes: 'ECG taken, awaiting blood work.' },
    { patientId: patients[1].id, description: 'Deep laceration on right arm from a fall.', severity: 'MEDIUM', status: 'RESOLVED', assignedTo: `Dr. ${doctorData[2].firstName} ${doctorData[2].lastName}`, resolvedAt: new Date(), notes: 'Sutured, 10 stitches provided.' },
    { patientId: patients[2].id, description: 'High fever 104F, persistent vomiting.', severity: 'HIGH', status: 'ACTIVE', assignedTo: `Dr. ${doctorData[1].firstName} ${doctorData[1].lastName}`, notes: 'Administered IV fluids and antipyretics.' },
    { description: 'Unidentified male, auto accident, head trauma.', severity: 'CRITICAL', status: 'ACTIVE', notes: 'Patient unconscious, moved to immediate surgery.' }
  ];

  for (const em of emergencies) {
    await prisma.emergencyCase.create({ data: em });
  }
  console.log(`✅ ${emergencies.length} Emergency Cases added`);

  console.log('🎉 Done! Your dashboards should now be fully populated.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
