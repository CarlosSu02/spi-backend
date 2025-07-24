interface IKey {
  id: string;
  name: string;
}

export interface IDepartment {
  id: string;
  name: string;
  centerId: string;
  facultyId: string;
}

export const departmentsSeed = (
  centersData: object,
  facultiesData: object,
): Record<string, IDepartment> => ({
  sistemas: {
    id: '7d42d30f-f76b-4027-acf1-06663e37c859',
    name: 'Ingeniería en Sistemas',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ingeniería'],
  },
  informatica: {
    id: '4663cd4a-a3a3-4cfe-9b3f-19e740f0d192',
    name: 'Área Infórmatica',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ingeniería'],
  },
  quimica: {
    id: 'eeaa5030-18ec-45a2-a373-93c57f49f70f',
    name: 'Biología, Química y Microbiología',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias'],
  },
  matematicas: {
    id: '98d8e699-6f2b-4f23-b0a4-c54a382d8c4f',
    name: 'Matemáticas y Física',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias'],
  },
  enfermeria: {
    id: '14aeb884-bf3c-4deb-9060-38b57563f190',
    name: 'Enfermería',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias Médicas'],
  },
  ingles: {
    id: '8a3cb735-59a3-4f66-ae63-c573f6583dfc',
    name: 'Inglés',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Humanidades y Artes'],
  },
  humanidades: {
    id: 'bac3daac-000d-47fe-963b-3539fdc3758a',
    name: 'Humanidades, Artes, Deportes y Sociales',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Humanidades y Artes'],
  },
  prod_ag: {
    id: 'c0def9f3-8e7a-4c62-9ff1-f702b6c3592f',
    name: 'Técnico en Producción Agrícola',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ingeniería'],
  },
  admon_empresas: {
    id: '64e55ce7-f657-404a-8257-af838829aff4',
    name: 'Administración de Empresas',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias Económicas'],
  },
  admon_ag: {
    id: '0f7bb894-6888-45c6-b3b2-5e315dc5ac0e',
    name: 'Administración de Empresas Agropecuarias',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias'],
  },
  pedagogia: {
    id: '554999c7-9dd2-4b8a-84dc-360f9e7ffdb2',
    name: 'Pedagogía',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Humanidades y Artes'],
  },
  sued: {
    id: '8d918575-438e-483d-8607-8f256d12d25a',
    name: 'Pedagogía del Sistema Universitario de Educación a Distancia (SUED)',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Humanidades y Artes'],
  },
  agroindustrial: {
    id: '012dc1d5-e92c-43d4-bc5c-4ae0594f8079',
    name: 'Ingeniería Agroindustrial',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ingeniería'],
  },
  comercio: {
    id: 'efbfad5f-9148-4b74-8c77-e67a0b391d0f',
    name: 'Comercio Internacional',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias Económicas'],
  },
  desarrollo: {
    id: '40b77303-e571-4c92-afea-598db117feda',
    name: 'Desarrollo Local',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias Sociales'],
  },
  admon_cafe: {
    id: '6355af19-9808-4414-b981-bbc63e27ad54',
    name: 'Técnico en Administración de Empresas Cafetaleras',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias Económicas'],
  },
  microfinanzas: {
    id: '074105c3-62a3-49d2-bbcb-be7e3bb48b66',
    name: 'Técnico en Microfinanzas',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ciencias Económicas'],
  },
  tucc: {
    id: '4d141fa9-9791-4d8d-a800-6b1ed4cc141b',
    name: 'Técnico Universitario en Control de Calidad del Café (TUCC)',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ingeniería'],
  },
  pecuaria: {
    id: '68cdff39-50dd-4fb5-a3fa-06d0d5bb597d',
    name: 'Pecuaria',
    centerId: centersData['UNAH Campus Copán'],
    facultyId: facultiesData['Ingeniería'],
  },
});
