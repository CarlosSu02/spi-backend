import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.createMany({
    data: [
      {
        name: 'ADMIN',
        description: 'Acceso a todo.',
      },
      {
        name: 'DIRECCION',
        description: 'Personal de dirección.',
      },
      {
        name: 'RRHH',
        description: 'Personal de recursos humanos.',
      },
      {
        name: 'COORDINADOR_AREA',
        description: 'Docente que es coordinador de una carrera/área.',
      },
      {
        name: 'DOCENTE',
        description:
          'Todos los docentes, estos deben crear el perfil de docente.',
      },
    ],
    skipDuplicates: true,
  });

  console.log({ roles });

  const adminRole = await prisma.role.findFirst({
    where: {
      name: 'ADMIN',
    },
    select: {
      id: true,
    },
  });

  if (!adminRole) throw new Error('Error: Rol Admin no encontrado.');

  const users = await prisma.user.createMany({
    data: [
      {
        name: 'user1',
        email: 'admin1@gmail.com',
        code: '12345',
        hash: await argon.hash('12345'),
        roleId: adminRole.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log({ users });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
