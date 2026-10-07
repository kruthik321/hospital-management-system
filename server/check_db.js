const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const roles = await prisma.role.count();
    const users = await prisma.user.count();
    const patients = await prisma.patient.count();
    const doctors = await prisma.doctor.count();
    const nurses = await prisma.nurse.count();
    const depts = await prisma.department.count();
    
    console.log('--- DB Status ---');
    console.log('Roles:', roles);
    console.log('Users:', users);
    console.log('Patients:', patients);
    console.log('Doctors:', doctors);
    console.log('Nurses:', nurses);
    console.log('Departments:', depts);
    console.log('-----------------');
  } catch (e) {
    console.error('Error connecting to DB:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
