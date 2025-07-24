import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import {
  careersSeed,
  categoriesSeed,
  centersSeed,
  contractsSeed,
  departmentsSeed,
  facultiesSeed,
  positionsRename,
  positionsSeed,
  postgraduatesSeed,
  rolesSeed,
  shiftsSeed,
  TPositions,
} from './data';
import { coursesSeed } from './data/courses.data';

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

  const allPositions: { id: string; name: string }[] =
    await prisma.position.findMany({
      select: {
        id: true,
        name: true,
      },
    });

  if (!allPositions)
    throw new Error('Error: Cargos académicos no encontrados.');

  // const positionsData = handleData(allPositions);
  hanldeDataWithTypes(allPositions, positionsRename);

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
  const departmentsData = departmentsSeed(centersData, facultiesData);
  const departments = await prisma.department.createMany({
    data: Object.values(departmentsData),
    skipDuplicates: true,
  });

  console.log({ departments });

  // Clases/Asignaturas
  const coursesData = coursesSeed(departmentsData);
  const courses = await prisma.course.createMany({
    data: Object.values(coursesData),
    skipDuplicates: true,
  });

  console.log({ courses });
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

const hanldeDataWithTypes = (
  array: { id: string; name: string }[],
  obj: { [key: string]: string },
): Record<string, string> => {
  const data = Object.fromEntries(
    array.map((role) => [obj[role.name], role.id]),
  );
  return data;
};
