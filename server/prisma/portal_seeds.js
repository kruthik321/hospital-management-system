const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Starting Specialized Portal Seeding...');

  // 1. Create Roles
  const roles = [
    { name: 'PARENT', description: 'Parent / Kids Health Portal User' },
    { name: 'PREGNANT_WOMAN', description: 'Pregnant Woman Care Portal User' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 2. Create Sample Users
  const hashedPassword = await bcrypt.hash('Portal@123', 10);
  
  const parentRole = await prisma.role.findUnique({ where: { name: 'PARENT' } });
  const pregnantRole = await prisma.role.findUnique({ where: { name: 'PREGNANT_WOMAN' } });

  await prisma.user.upsert({
    where: { email: 'parent.test@hospital.com' },
    update: {},
    create: {
      email: 'parent.test@hospital.com',
      password: hashedPassword,
      firstName: 'Lily',
      lastName: 'Potter',
      roleId: parentRole.id,
    }
  });

  await prisma.user.upsert({
    where: { email: 'mom.test@hospital.com' },
    update: {},
    create: {
      email: 'mom.test@hospital.com',
      password: hashedPassword,
      firstName: 'Elena',
      lastName: 'Gilbert',
      roleId: pregnantRole.id,
    }
  });

  // 3. Create Home Remedies
  const remedies = [
    { title: 'Ginger Honey Tea', content: 'Soothing for kids cough.', portal: 'KIDS', category: 'COLD' },
    { title: 'ORS Solution', content: 'Hydration for fever.', portal: 'KIDS', category: 'FEVER' },
    { title: 'Ginger & Lemon Infusion', content: 'Nausea relief.', portal: 'PREGNANCY', category: 'NAUSEA' },
    { title: 'Epsom Salt Soak', content: 'Swelling relief.', portal: 'PREGNANCY', category: 'SWELLING' }
  ];

  for (const r of remedies) {
    await prisma.homeRemedy.create({ data: r });
  }

  // 4. Create Vaccinations
  const vaccines = [
    { name: 'BCG', ageGroup: 'At Birth', description: 'Tuberculosis' },
    { name: 'Polio (IPV)', ageGroup: '6 Weeks', description: 'Paralysis prevention' },
    { name: 'MMR', ageGroup: '9 Months', description: 'Measles, Mumps, Rubella' }
  ];

  for (const v of vaccines) {
    await prisma.vaccination.upsert({
      where: { name: v.name },
      update: {},
      create: v
    });
  }

  console.log('✅ Portals Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
