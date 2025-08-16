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
import { MULTIMEDIA_TYPES } from '../src/modules/complementary-activities/enums';

const handleData = (array: { id: string; name: string }[]) =>
  Object.fromEntries(array.map((role) => [role.name, role.id]));

const prisma = new PrismaClient();

async function main() {
  const rolesData = handleData(rolesSeed);

  const [
    roles,
    users,
    undergradDegrees,
    postgradDegrees,
    categories,
    contracts,
    shifts,
    positions,
    centers,
    faculties,
    departments,
    courses,
    brands,
    conditions,
    monitorTypes,
    monitorSizes,
    pcTypes,
    connectivities,
    roomTypes,
    audioEquipments,
    buildings,
    academicPeriods,
    modalities,
    activityTypes,
    multimediaTypes,
  ] = await Promise.all([
    prisma.role.createMany({
      data: rolesSeed,
      skipDuplicates: true,
    }),
    prisma.user.createMany({
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
    }),
    prisma.undergraduate_Degree.createMany({
      data: careersSeed,
      skipDuplicates: true,
    }),
    prisma.postgraduate_Degree.createMany({
      data: postgraduatesSeed,
      skipDuplicates: true,
    }),
    prisma.teacher_Category.createMany({
      data: categoriesSeed,
      skipDuplicates: true,
    }),
    prisma.contract_Type.createMany({
      data: contractsSeed,
      skipDuplicates: true,
    }),
    prisma.shift.createMany({
      data: shiftsSeed,
      skipDuplicates: true,
    }),
    prisma.position.createMany({
      data: positionsSeed,
      skipDuplicates: true,
    }),
    prisma.center.createMany({
      data: Object.values(centersSeed),
      skipDuplicates: true,
    }),
    prisma.faculty.createMany({
      data: Object.values(facultiesSeed),
      skipDuplicates: true,
    }),
    prisma.department.createMany({
      data: Object.values(departmentsSeed),
      skipDuplicates: true,
    }),
    prisma.course.createMany({
      data: Object.values(coursesSeed),
      skipDuplicates: true,
    }),
    prisma.brand.createMany({
      data: Object.values(brandsSeed),
      skipDuplicates: true,
    }),
    prisma.condition.createMany({
      data: Object.values(conditionsSeed),
      skipDuplicates: true,
    }),
    prisma.monitor_Type.createMany({
      data: Object.values(monitorTypesSeed),
      skipDuplicates: true,
    }),
    prisma.monitor_Size.createMany({
      data: Object.values(monitorSizesSeed),
      skipDuplicates: true,
    }),
    prisma.pC_Type.createMany({
      data: Object.values(pcTypesSeed),
      skipDuplicates: true,
    }),
    prisma.connectivity.createMany({
      data: Object.values(connectivitiesSeed),
      skipDuplicates: true,
    }),
    prisma.room_Type.createMany({
      data: Object.values(roomTypesSeed),
      skipDuplicates: true,
    }),
    prisma.audio_Equipment.createMany({
      data: Object.values(audioEquipmentsSeed),
      skipDuplicates: true,
    }),
    prisma.building.createMany({
      data: buildingsSeed,
      skipDuplicates: true,
    }),
    prisma.academic_Period.createMany({
      data: academicPeriodsSeed,
      skipDuplicates: true,
    }),
    prisma.modality.createMany({
      data: modalitiesSeed,
      skipDuplicates: true,
    }),
    prisma.activity_Type.createMany({
      data: activityTypesSeed,
      skipDuplicates: true,
    }),
    prisma.multimedia_Type.createMany({
      data: Object.values(MULTIMEDIA_TYPES).map((mt) => ({
        description: mt,
      })),
      skipDuplicates: true,
    }),
  ]);

  console.log({ roles });

  console.log({ users });

  // Pregrados
  console.log({ undergradDegrees });

  // Postgrados
  console.log({ postgradDegrees });

  // Categorias
  console.log({ categories });

  // Tipos de contratos
  console.log({ contracts });

  // Jornadas
  console.log({ shifts });

  // Cargos academicos
  console.log({ positions });

  // Centro
  console.log({ centers });

  // Facultades
  console.log({ faculties });

  // Departamentos
  console.log({ departments });

  // Clases/Asignaturas
  console.log({ courses });

  // Brands
  console.log({ brands });

  // Conditions
  console.log({ conditions });

  // Monitor Types
  console.log({ monitorTypes });

  // Monitor Sizes
  console.log({ monitorSizes });

  // PC Types
  console.log({ pcTypes });

  // Connectivities
  console.log({ connectivities });

  // RoomTypes
  console.log({ roomTypes });

  // AudioEquipments
  console.log({ audioEquipments });

  // Buildings
  console.log({ buildings });

  // Periodos Academicos
  console.log({ academicPeriods });

  // Modalidades
  console.log({ modalities });

  // Tipos de actividades complementarias
  console.log({ activityTypes });

  // Tipos de multimedia
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
