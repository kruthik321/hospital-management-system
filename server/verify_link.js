const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test_db() {
  try {
    const patients = await prisma.patient.count();
    const doctors = await prisma.doctor.count();
    const nurses = await prisma.nurse.count();
    
    console.log('--- DATABASE LINK CHECK ---');
    console.log('PATIENTS:', patients);
    console.log('DOCTORS:', doctors);
    console.log('NURSES:', nurses);
    console.log('---------------------------');
    
    if (patients > 0 && doctors > 0 && nurses > 0) {
      console.log('RESULT: DATABASE IS FULLY LINKED AND POPULATED.');
    } else {
      console.log('RESULT: DATABASE LINKED BUT EMPTY OR SEMI-EMPTY.');
    }
  } catch (err) {
    console.error('RESULT: DATABASE NOT LINKED - ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test_db();
