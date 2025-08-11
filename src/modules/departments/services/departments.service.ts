import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TDepartment } from '../types';
import { EPosition } from 'src/modules/positions/enums';
import { TeacherCategoriesController } from 'src/modules/teachers-config/controllers/teacher-categories.controller';
import { TPosition } from 'src/modules/positions/types';
import { TUser } from 'src/modules/users/types';
import { TCustomPick } from 'src/common/types';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<TDepartment> {
    const newDepartment = await this.prisma.department.create({
      data: {
        ...createDepartmentDto,
      },
    });

    return newDepartment;
  }

  async findAll(): Promise<TDepartment[]> {
    const departments = await this.prisma.department.findMany();

    // if (departments.length === 0)
    //   throw new NotFoundException('No se encontraron datos.'); // tambien se puede devolver un 200 como consulta exitosa pero con data []

    return departments;
  }

  async findAllWithCoordinators(): Promise<TDepartment[]> {
    const departments = await this.prisma.department.findMany({
      where: {
        teacherAppointments: {
          some: {
            position: {
              // name: EPosition.DEPARTMENT_HEAD,
              name: {
                contains: EPosition.DEPARTMENT_HEAD,
              },
            },
          },
        },
      },
      include: {
        teacherAppointments: {
          where: {
            position: {
              name: EPosition.DEPARTMENT_HEAD,
            },
          },
          select: {
            position: true,
            teacher: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // if (departments.length === 0)
    //   throw new NotFoundException('No se encontraron datos.'); // tambien se puede devolver un 200 como consulta exitosa pero con data []

    const mapped: Array<
      TDepartment & {
        coordinator: {
          id: string;
          code: string;
          name: string;
          teacherId: string;
        };
      }
    > = (
      departments as (TDepartment & {
        teacherAppointments: {
          position: TPosition;
          teacher: {
            id: string;
            user: TCustomPick<TUser, 'id' | 'code' | 'name'>;
          };
        }[];
      })[]
    ).map((dep) => {
      const { teacherAppointments, ...depToMap } = dep;
      const tc = teacherAppointments[0];

      return {
        ...depToMap,
        coordinator: {
          id: tc.teacher.id,
          teacherId: tc.teacher.id,
          name: tc.teacher.user.name,
          code: tc.teacher.user.code,
        },
      };
    });

    return mapped;
  }

  async findOne(id: string): Promise<TDepartment> {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!department)
      throw new NotFoundException(
        `El departamento con id <${id}> no fue encontrado.`,
      );

    // throw new HttpException(
    //   `El departamento con id <${id}> no fue encontrado.`,
    //   HttpStatus.NOT_FOUND,
    // );

    return department;
  }

  async findOneByName(name: string): Promise<TDepartment> {
    const department = await this.prisma.department.findUnique({
      where: {
        name,
      },
    });

    if (!department)
      throw new NotFoundException(
        `El departamento con nombre <${name}> no fue encontrado.`,
      );

    // throw new HttpException(
    //   `El departamento con id <${id}> no fue encontrado.`,
    //   HttpStatus.NOT_FOUND,
    // );

    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<TDepartment> {
    const departmentUpdate = await this.prisma.department.update({
      where: {
        id,
      },
      data: {
        ...updateDepartmentDto,
      },
    });

    return departmentUpdate;
  }

  async remove(id: string): Promise<TDepartment> {
    const departmentDelete = await this.prisma.department.delete({
      where: {
        id,
      },
    });

    return departmentDelete;
  }
}
