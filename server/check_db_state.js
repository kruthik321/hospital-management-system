const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ include: { role: true } });
  const roles = await prisma.role.findMany();
  console.log('--- ROLES ---');
  console.log(JSON.stringify(roles, null, 2));
  console.log('--- USERS ---');
  console.log(JSON.stringify(users.map(u => ({ email: u.email, role: u.role.name })), null, 2));
  await prisma.$disconnect();
}

check();
