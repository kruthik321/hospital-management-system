const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting MEGA SEED - Every table will have 6+ records...');

  const passwordHash = await bcrypt.hash('Hms@123', 10);

  // 1. Roles
  const standardRoles = ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'STAFF', 'PARENT', 'PREGNANT_WOMAN'];
  for (const roleName of standardRoles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName, description: `${roleName} Role` }
    });
  }
  const roles = await prisma.role.findMany();
  const getRole = (name) => roles.find(r => r.name === name).id;
  console.log('✅ Roles: 7 records');

  // 2. Departments
  const deptNames = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 
    'General Medicine', 'Ophthalmology', 'ENT', 'Gynecology', 'Psychiatry', 'Radiology', 'Pathology'
  ];
  for (const name of deptNames) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name, description: `Specialized ${name} department`, floor: `${Math.floor(Math.random() * 5) + 1}th Floor`, isActive: true }
    });
  }
  const depts = await prisma.department.findMany();
  console.log(`✅ Departments: ${depts.length} records`);

  // 3. Users (Admins, Doctors, Nurses, Patients, Staff)
  const userRoles = ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'STAFF'];
  for (const roleName of userRoles) {
    const roleId = getRole(roleName);
    const existingCount = await prisma.user.count({ where: { roleId } });
    for (let i = existingCount; i < 6; i++) {
      const email = `${roleName.toLowerCase()}${i + 1}@hms.com`;
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          password: passwordHash,
          firstName: roleName.charAt(0) + roleName.slice(1).toLowerCase(),
          lastName: `User ${i + 1}`,
          phone: `900000000${i + 1}`,
          roleId,
          isActive: true,
          ...(roleName === 'DOCTOR' ? { doctor: { create: { specialization: 'General', licenseNumber: `LIC-D-${roleName}-${i + 1}`, departmentId: depts[i % depts.length].id } } } : {}),
          ...(roleName === 'NURSE' ? { nurse: { create: { departmentId: depts[i % depts.length].id, shiftType: 'MORNING' } } } : {}),
          ...(roleName === 'PATIENT' ? { patient: { create: { gender: 'MALE', bloodGroup: 'O+' } } } : {}),
          ...(roleName === 'STAFF' ? { staff: { create: { designation: 'Assistant', departmentId: depts[i % depts.length].id } } } : {}),
        }
      });
    }
  }
  console.log('✅ Base Users: 30+ records');

  const doctors = await prisma.doctor.findMany();
  const patients = await prisma.patient.findMany();
  const nurses = await prisma.nurse.findMany();

  // 4. Rooms & Beds
  const roomTypes = ['GENERAL', 'SEMI_PRIVATE', 'PRIVATE', 'ICU', 'OPERATION'];
  for (let i = 0; i < 6; i++) {
    const roomNumber = `ROOM-${100 + i}`;
    await prisma.room.upsert({
      where: { roomNumber },
      update: {},
      create: {
        roomNumber,
        type: roomTypes[i % roomTypes.length],
        floor: `${Math.floor(i / 2) + 1}st`,
        charges: 1000 * (i + 1),
        departmentId: depts[0].id,
        beds: { create: [{ bedNumber: `${roomNumber}-B1` }, { bedNumber: `${roomNumber}-B2` }] }
      }
    });
  }
  const beds = await prisma.bed.findMany();
  console.log('✅ Rooms & Beds: 12+ records');

  // 5. Appointments
  const apptCount = await prisma.appointment.count();
  for (let i = apptCount; i < 6; i++) {
    await prisma.appointment.create({
      data: {
        patientId: patients[i % patients.length].id,
        doctorId: doctors[i % doctors.length].id,
        appointmentDate: new Date(),
        timeSlot: `${10+i}:30 AM`,
        status: 'SCHEDULED',
        reason: 'Regular Health Checkup'
      }
    });
  }
  const appointments = await prisma.appointment.findMany();
  console.log('✅ Appointments: 6+ records');

  // 6. Medications & Inventory
  for (let i = 0; i < 6; i++) {
    const name = `Medication-${i + 1}`;
    await prisma.medication.upsert({
      where: { id: i + 1 }, // Using ID for simplicity in upsert
      update: {},
      create: {
        id: i + 1,
        name,
        genericName: `Generic-${name}`,
        price: 50.0,
        inventory: { create: { itemName: `INV-${name}`, quantity: 500, category: 'MEDICINE' } }
      }
    }).catch(async (e) => {
        // Fallback if ID exists
        await prisma.medication.create({
            data: { name: `${name}-Extra`, price: 50.0, inventory: { create: { itemName: `INV-${name}-Extra`, quantity: 500, category: 'MEDICINE' } } }
        }).catch(() => {});
    });
  }
  const meds = await prisma.medication.findMany();
  console.log('✅ Medications & Inventory: 6+ records');

  // 7. Lab Tests & Orders
  for (let i = 0; i < 6; i++) {
    const name = `LabTest-${i + 1}`;
    const test = await prisma.labTest.upsert({
      where: { id: i + 1 },
      update: {},
      create: { id: i + 1, name, category: 'General', cost: 250.0 }
    }).catch(async () => await prisma.labTest.findFirst({ where: { name } }));

    if (test) {
        await prisma.labOrder.create({
            data: {
                patientId: patients[i % patients.length].id,
                doctorId: doctors[i % doctors.length].id,
                labTestId: test.id,
                status: 'COMPLETED',
                labReport: { create: { result: 'Normal', reportedBy: 'Lab Technician A' } }
            }
        });
    }
  }
  console.log('✅ Lab Tests, Orders, Reports: 6+ records');

  // 8. Vitals & Medical Records
  for (let i = 0; i < 6; i++) {
    const patientId = patients[i % patients.length].id;
    await prisma.vital.create({
      data: {
        patientId,
        nurseId: nurses[0].id,
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.4,
        weight: 70.5
      }
    });
    await prisma.medicalRecord.create({
      data: {
        patientId,
        recordType: 'CONSULTATION',
        title: `History Record ${i + 1}`,
        description: 'Standard consultation notes.'
      }
    });
  }
  console.log('✅ Vitals & Medical Records: 6+ records');

  // 9. Admissions & Discharges
  for (let i = 0; i < 6; i++) {
    const patientId = patients[i % patients.length].id;
    const admission = await prisma.admission.create({
      data: {
        patientId,
        admitDate: new Date(),
        reason: 'Observation',
        status: 'DISCHARGED',
        discharge: { create: { dischargeDate: new Date(), summary: 'Patient stable.' } }
      }
    });
    await prisma.roomAssignment.create({
      data: {
        patientId,
        bedId: beds[i % beds.length].id,
        status: 'DISCHARGED'
      }
    });
  }
  console.log('✅ Admissions & Discharges: 6+ records');

  // 10. Billing & Payments
  for (let i = 0; i < 6; i++) {
    const patientId = patients[i % patients.length].id;
    await prisma.billing.create({
      data: {
        patientId,
        totalAmount: 500.0,
        netAmount: 500.0,
        status: 'PAID',
        items: { create: [{ description: 'General Consultation', unitPrice: 500.0, totalPrice: 500.0 }] },
        payments: { create: { amount: 500.0, paymentMethod: 'CASH', status: 'COMPLETED' } }
      }
    });
  }
  console.log('✅ Billing & Payments: 6+ records');

  // 11. Specialized Data (Kids, Pregnancy)
  const pRole = getRole('PARENT');
  const mRole = getRole('PREGNANT_WOMAN');

  // Create Vaccines
  const vaccineNames = ['BCG', 'Hepatitis B', 'Polio', 'DTP', 'MMR', 'Flu'];
  for (const name of vaccineNames) {
    await prisma.vaccination.upsert({
      where: { name },
      update: {},
      create: { name, recommendedAge: 'Varies', category: 'GENERAL' }
    });
  }
  const vaccines = await prisma.vaccination.findMany();

  for (let i = 0; i < 12; i++) {
    const uEmail = `portal.user${i + 1}@hms.com`;
    const user = await prisma.user.upsert({
      where: { email: uEmail },
      update: {},
      create: {
        email: uEmail,
        password: passwordHash,
        firstName: 'Portal',
        lastName: `Test ${i + 1}`,
        roleId: i % 2 === 0 ? pRole : mRole
      }
    });

    if (i % 2 === 0) {
      const existingKid = await prisma.kidProfile.findFirst({
        where: { parentId: user.id, name: `Kid-${i + 1}` }
      });
      let kid = existingKid;
      if (!existingKid) {
        kid = await prisma.kidProfile.create({
          data: {
            parentId: user.id,
            name: `Kid-${i + 1}`,
            age: 4,
            gender: 'MALE'
          }
        });
      }
      await prisma.kidVaccination.upsert({
        where: { kidId_vaccinationId: { kidId: kid.id, vaccinationId: vaccines[i % vaccines.length].id } },
        update: {},
        create: { kidId: kid.id, vaccinationId: vaccines[i % vaccines.length].id, status: 'COMPLETED' }
      });
    } else {
      const existingProfile = await prisma.pregnancyProfile.findUnique({
        where: { motherId: user.id }
      });
      if (!existingProfile) {
        await prisma.pregnancyProfile.create({
          data: {
            motherId: user.id,
            motherName: `${user.firstName} ${user.lastName}`,
            expectedDeliveryDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
            pregnancyWeek: 12
          }
        });
      }
    }
  }
  console.log('✅ Specialized Portal Data: 6+ records');

  // 12. Support & System (FAQ, Remedies, SOP, AuditLog, Notifications, Feedback, Emergency)
  for (let i = 0; i < 6; i++) {
    await prisma.fAQ.create({ data: { question: `Q${i+1}?`, answer: `A${i+1}`, category: 'GENERAL' } });
    await prisma.homeRemedy.create({ data: { title: `Remedy ${i+1}`, description: 'Instructions...', category: 'KIDS', illnessType: 'FEVER' } });
    await prisma.sOP.create({ data: { title: `SOP ${i+1}`, steps: 'Step 1, Step 2', portalType: 'KIDS' } });
    
    const ptId = patients[i % patients.length].id;
    await prisma.feedback.create({ data: { patientId: ptId, rating: 5, comment: 'Good service' } });
    await prisma.notification.create({ data: { userId: doctors[0].userId, title: 'Alert', message: `MSG-${i+1}` } });
    await prisma.auditLog.create({ data: { userId: doctors[0].userId, action: 'CREATE', tableName: 'patients', recordId: ptId } });
    await prisma.emergencyCase.create({ data: { patientId: ptId, description: 'Accident', severity: 'HIGH' } });
  }
  console.log('✅ Support, System & Emergency: 6+ records');

  console.log('🎉 MEGA SEED COMPLETE! Verification counts incoming...');
  
  // Quick count verification
  const models = ['User', 'Patient', 'Doctor', 'Nurse', 'Department', 'Room', 'Bed', 'Appointment', 'Medication', 'LabTest', 'Billing', 'KidProfile', 'PregnancyProfile', 'FAQ', 'EmergencyCase'];
  for (const model of models) {
    const count = await prisma[model.charAt(0).toLowerCase() + model.slice(1)].count();
    console.log(`${model}: ${count}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
