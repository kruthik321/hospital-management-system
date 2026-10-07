const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.user.findMany({
    where: { role: { name: 'ADMIN' } },
    select: { email: true, firstName: true }
  });
  console.log('ADMINS:', admins);
  await prisma.$disconnect();
}

main();
