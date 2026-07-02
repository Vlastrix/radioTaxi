import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5501/radiotaxi';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = ['ADMIN', 'OPERATOR', 'DRIVER', 'CLIENT'];
  const roleIds: Record<string, number> = {};

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    roleIds[roleName] = role.id;
  }

  const hashedPassword = await bcrypt.hash('123456', 10);

  // Admin
  await prisma.user.upsert({
    where: { email: 'vladi@admin.com' },
    update: { password: hashedPassword, roleId: roleIds['ADMIN'] },
    create: {
      email: 'vladi@admin.com',
      password: hashedPassword,
      name: 'Vladi Admin',
      roleId: roleIds['ADMIN'],
    },
  });

  // Operadora
  await prisma.user.upsert({
    where: { email: 'vladi@operadora.com' },
    update: { password: hashedPassword, roleId: roleIds['OPERATOR'] },
    create: {
      email: 'vladi@operadora.com',
      password: hashedPassword,
      name: 'Vladi Operadora',
      roleId: roleIds['OPERATOR'],
    },
  });

  // Chofer
  const driverUser = await prisma.user.upsert({
    where: { email: 'vladi@chofer.com' },
    update: { password: hashedPassword, roleId: roleIds['DRIVER'] },
    create: {
      email: 'vladi@chofer.com',
      password: hashedPassword,
      name: 'Vladi Chofer',
      roleId: roleIds['DRIVER'],
    },
  });

  // Crear el registro del Driver en la tabla Driver
  await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: { name: 'Vladi Chofer' },
    create: {
      userId: driverUser.id,
      name: 'Vladi Chofer',
      phone: '77712345',
      license: 'LIC-12345'
    }
  });

  // Cliente
  const clientUser = await prisma.user.upsert({
    where: { email: 'vladi@cliente.com' },
    update: { password: hashedPassword, roleId: roleIds['CLIENT'] },
    create: {
      email: 'vladi@cliente.com',
      password: hashedPassword,
      name: 'Vladi Cliente',
      roleId: roleIds['CLIENT'],
    },
  });

  // Crear el registro del Client en la tabla Client
  await prisma.client.upsert({
    where: { userId: clientUser.id },
    update: { name: 'Vladi Cliente' },
    create: {
      userId: clientUser.id,
      name: 'Vladi Cliente',
      phone: '66654321',
      email: 'vladi@cliente.com'
    }
  });

  console.log('Semillas creadas con éxito:');
  console.log('Admin: vladi@admin.com / 123456');
  console.log('Operadora: vladi@operadora.com / 123456');
  console.log('Chofer: vladi@chofer.com / 123456');
  console.log('Cliente: vladi@cliente.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
