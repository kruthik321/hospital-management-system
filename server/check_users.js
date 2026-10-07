const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    include: { role: true }
  });
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

checkUsers();
