const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Starting Portal Validation & Re-seeding...');

  // 1. Ensure Roles Exist
  const roles = [
    { name: 'PARENT', desc: 'Parent / Kids Health Portal User' },
    { name: 'PREGNANT_WOMAN', desc: 'Pregnant Woman Care Portal User' }
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.desc },
      create: { name: r.name, description: r.desc }
    });
  }
  console.log('✅ Specialized roles verified.');

  const parentRole = await prisma.role.findUnique({ where: { name: 'PARENT' } });
  const pregnantRole = await prisma.role.findUnique({ where: { name: 'PREGNANT_WOMAN' } });

  // 2. Hash Password (Portal@123)
  const portalHash = await bcrypt.hash('Portal@123', 10);

  // 3. Upsert Specialized Users
  const specializedUsers = [
    {
      email: 'parent.test@hospital.com',
      password: portalHash,
      firstName: 'Katherine',
      lastName: 'Pierce',
      roleId: parentRole.id
    },
    {
      email: 'mom.test@hospital.com',
      password: portalHash,
      firstName: 'Elena',
      lastName: 'Gilbert',
      roleId: pregnantRole.id
    }
  ];

  for (const u of specializedUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: u.password },
      create: u
    });
  }
  console.log('✅ Specialized portal users seeded with hashed passwords.');

  console.log('🎉 Done! All portal accounts are now active with password: Portal@123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
