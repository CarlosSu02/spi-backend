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

  // const adminRole = await prisma.role.findFirst({
  //   where: {
  //     name: 'ADMIN',
  //   },
  //   select: {
  //     id: true,
  //   },
  // });

  const allRoles: { id: string; name: string }[] = await prisma.role.findMany({
    // where: {
    //   name: 'ADMIN',
    // },
    select: {
      id: true,
      name: true,
    },
  });

  if (!allRoles) throw new Error('Error: Roles no encontrados.');

  const rolesData = handleRoles(allRoles);

  const users = await prisma.user.createMany({
    data: [
      {
        name: 'user1',
        email: 'admin1@gmail.com',
        code: '12345',
        hash: await argon.hash('12345'),
        roleId: rolesData.ADMIN,
      },
      {
        name: 'user2',
        email: 'teacher1@gmail.com',
        code: '54321',
        hash: await argon.hash('12345'),
        roleId: rolesData.DOCENTE,
      },
      {
        name: 'user3',
        email: 'rrhh1@gmail.com',
        code: '78900',
        hash: await argon.hash('12345'),
        roleId: rolesData.RRHH,
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

const handleRoles = (array: { id: string; name: string }[]) => {
  // const values: Record<string, string> = {};
  //
  // array.forEach((el) => {
  //   values[el.name] = el.id;
  // });
  //
  // return values;

  const roles = Object.fromEntries(array.map((role) => [role.name, role.id]));

  return roles;
};
