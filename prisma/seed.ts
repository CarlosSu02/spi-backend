import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import {
  careersSeed,
  categoriesSeed,
  centersSeed,
  contractsSeed,
  facultiesSeed,
  positionsSeed,
  postgraduatesSeed,
  rolesSeed,
  shiftsSeed,
} from './data';

const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.createMany({
    data: rolesSeed,
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

  const rolesData = handleData(allRoles);

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

  // Pregrados
  const undergradDegrees = await prisma.undergraduate_Degree.createMany({
    data: careersSeed.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log({ undergradDegrees });

  // Postgrados
  const postgradDegrees = await prisma.postgraduate_Degree.createMany({
    data: postgraduatesSeed.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log({ postgradDegrees });

  // Categorias
  const categories = await prisma.teacher_Category.createMany({
    data: categoriesSeed,
    skipDuplicates: true,
  });

  console.log({ categories });

  // Tipos de contratos
  const contracts = await prisma.contract_Type.createMany({
    data: contractsSeed.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log({ contracts });

  // Jornadas
  const shifts = await prisma.shift.createMany({
    data: shiftsSeed.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log({ shifts });

  // Cargos academicos
  const positions = await prisma.position.createMany({
    data: positionsSeed.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log({ positions });

  // Centro
  const centers = await prisma.center.createMany({
    data: centersSeed.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log({ centers });

  // Facultades
  const faculties = await prisma.faculty.createMany({
    data: facultiesSeed.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log({ faculties });

  const allFaculties: { id: string; name: string }[] =
    await prisma.faculty.findMany({
      select: {
        id: true,
        name: true,
      },
    });

  if (!allFaculties) throw new Error('Error: Facultades no encontrados.');

  const facultiesData = handleData(allFaculties);

  const allCenters: { id: string; name: string }[] =
    await prisma.center.findMany({
      select: {
        id: true,
        name: true,
      },
    });

  if (!allCenters) throw new Error('Error: Facultades no encontrados.');

  const centersData = handleData(allCenters);

  // Departamentos
  const departments = await prisma.department.createMany({
    data: [
      {
        name: 'Ingeniería en Sistemas',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ingeniería'],
      },
      {
        name: 'Química y Biología',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias'],
      },
      {
        name: 'Matemáticas',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias'],
      },
      {
        name: 'Enfermería',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias Médicas'],
      },
      {
        name: 'Inglés',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Humanidades y Artes'],
      },
      {
        name: 'Humanidades',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Humanidades y Artes'],
      },
      {
        name: 'Técnico en Producción Agrícola',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ingeniería'],
      },
      {
        name: 'Administración de Empresas',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias Económicas'],
      },
      {
        name: 'Administración de Empresas Agropecuarias',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias'],
      },
      {
        name: 'Pedagogía',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Humanidades y Artes'],
      },
      {
        name: 'Ingeniería Agroindustrial',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ingeniería'],
      },
      {
        name: 'Comercio Internacional',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias Económicas'],
      },
      {
        name: 'Desarrollo Local',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias Sociales'],
      },
      {
        name: 'Administración de Empresas Cafetaleras',
        centerId: centersData['UNAH Campus Copán'],
        facultyId: facultiesData['Ciencias Económicas'],
      },
    ],
    skipDuplicates: true,
  });

  console.log({ departments });
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

const handleData = (array: { id: string; name: string }[]) => {
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
