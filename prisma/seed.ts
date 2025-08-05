import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import {
  academicPeriodsSeed,
  activityTypesSeed,
  brandsSeed,
  careersSeed,
  categoriesSeed,
  centersSeed,
  conditionsSeed,
  contractsSeed,
  coursesSeed,
  departmentsSeed,
  facultiesSeed,
  modalitiesSeed,
  monitorSizesSeed,
  monitorTypesSeed,
  pcTypesSeed,
  positionsSeed,
  postgraduatesSeed,
  rolesSeed,
  shiftsSeed,
} from './data';
import {
  audioEquipmentsSeed,
  buildingsSeed,
  connectivitiesSeed,
  roomTypesSeed,
} from './data/infraestructure.data';
import { EMultimediaType } from '../src/modules/complementary-activities/enums';

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

  // const allRoles: { id: string; name: string }[] = await prisma.role.findMany({
  //   // where: {
  //   //   name: 'ADMIN',
  //   // },
  //   select: {
  //     id: true,
  //     name: true,
  //   },
  // });
  //
  // if (!allRoles) throw new Error('Error: Roles no encontrados.');

  const rolesData = handleData(rolesSeed);

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
      {
        name: 'user4',
        email: 'rrhh2@gmail.com',
        code: '78910',
        hash: await argon.hash('Temporal.12345'),
        roleId: rolesData.RRHH,
      },
    ],
    skipDuplicates: true,
  });

  console.log({ users });

  // Pregrados
  const undergradDegrees = await prisma.undergraduate_Degree.createMany({
    data: careersSeed,
    skipDuplicates: true,
  });

  console.log({ undergradDegrees });

  // Postgrados
  const postgradDegrees = await prisma.postgraduate_Degree.createMany({
    data: postgraduatesSeed,
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
    data: contractsSeed,
    skipDuplicates: true,
  });

  console.log({ contracts });

  // Jornadas
  const shifts = await prisma.shift.createMany({
    data: shiftsSeed,
    skipDuplicates: true,
  });

  console.log({ shifts });

  // Cargos academicos
  const positions = await prisma.position.createMany({
    data: positionsSeed,
    skipDuplicates: true,
  });

  console.log({ positions });

  // Centro
  const centers = await prisma.center.createMany({
    data: Object.values(centersSeed),
    skipDuplicates: true,
  });

  console.log({ centers });

  // Facultades
  const faculties = await prisma.faculty.createMany({
    data: Object.values(facultiesSeed),
    skipDuplicates: true,
  });

  console.log({ faculties });

  // const allFaculties: { id: string; name: string }[] =
  //   await prisma.faculty.findMany({
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //   });

  // if (!allFaculties) throw new Error('Error: Facultades no encontrados.');

  // const facultiesData = handleData(allFaculties);

  // const allCenters: { id: string; name: string }[] =
  //   await prisma.center.findMany({
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //   });
  //
  // if (!allCenters) throw new Error('Error: Facultades no encontrados.');
  //
  // const centersData = handleData(allCenters);

  // Departamentos
  const departments = await prisma.department.createMany({
    data: Object.values(departmentsSeed),
    skipDuplicates: true,
  });

  console.log({ departments });

  // Clases/Asignaturas
  const courses = await prisma.course.createMany({
    data: Object.values(coursesSeed),
    skipDuplicates: true,
  });

  console.log({ courses });

  // Brands
  const brands = await prisma.brand.createMany({
    data: Object.values(brandsSeed),
    skipDuplicates: true,
  });

  console.log({ brands });

  // Conditions
  const conditions = await prisma.condition.createMany({
    data: Object.values(conditionsSeed),
    skipDuplicates: true,
  });

  console.log({ conditions });

  // Monitor Types
  const monitorTypes = await prisma.monitor_Type.createMany({
    data: Object.values(monitorTypesSeed),
    skipDuplicates: true,
  });

  console.log({ monitorTypes });

  // Monitor Sizes
  const monitorSizes = await prisma.monitor_Size.createMany({
    data: Object.values(monitorSizesSeed),
    skipDuplicates: true,
  });

  console.log({ monitorSizes });

  // PC Types
  const pcTypes = await prisma.pC_Type.createMany({
    data: Object.values(pcTypesSeed),
    skipDuplicates: true,
  });

  console.log({ pcTypes });

  // Connectivities
  const connectivities = await prisma.connectivity.createMany({
    data: Object.values(connectivitiesSeed),
    skipDuplicates: true,
  });

  console.log({ connectivities });

  // RoomTypes
  const roomTypes = await prisma.room_Type.createMany({
    data: Object.values(roomTypesSeed),
    skipDuplicates: true,
  });

  console.log({ roomTypes });

  // AudioEquipments
  const audioEquipments = await prisma.audio_Equipment.createMany({
    data: Object.values(audioEquipmentsSeed),
    skipDuplicates: true,
  });

  console.log({ audioEquipments });

  // Buildings
  const buildings = await prisma.building.createMany({
    data: buildingsSeed,
    skipDuplicates: true,
  });

  console.log({ buildings });

  // Periodos Academicos
  const academicPeriods = await prisma.academic_Period.createMany({
    data: academicPeriodsSeed,
    skipDuplicates: true,
  });

  console.log({ academicPeriods });

  // Modalidades
  const modalities = await prisma.modality.createMany({
    data: modalitiesSeed,
    skipDuplicates: true,
  });

  console.log({ modalities });

  // Tipos de actividades complementarias
  const activityTypes = await prisma.activity_Type.createMany({
    data: activityTypesSeed,
    skipDuplicates: true,
  });

  console.log({ activityTypes });

  // Tipos de multimedia
  const multimediaTypes = await prisma.multimedia_Type.createMany({
    data: Object.values(EMultimediaType).map((mt) => ({
      description: mt,
    })),
    skipDuplicates: true,
  });

  console.log({ multimediaTypes });
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

  const data = Object.fromEntries(array.map((role) => [role.name, role.id]));

  return data;
};
