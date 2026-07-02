import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = 'postgresql://postgres:postgres@localhost:5501/radiotaxi';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
    },
  });

  const hashedPassword = await bcrypt.hash('1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'vladi@gmail.com' },
    update: { password: hashedPassword }, // Update password just in case
    create: {
      email: 'vladi@gmail.com',
      password: hashedPassword,
      name: 'Vladi',
      roleId: adminRole.id,
    },
  });

  console.log('Usuario administrador creado con éxito:');
  console.log('Email: vladi@gmail.com');
  console.log('Contraseña: 1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
