import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.createMany({
    data: [
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
  });

  console.log({ roles });
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
