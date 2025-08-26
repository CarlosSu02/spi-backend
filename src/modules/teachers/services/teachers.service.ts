import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { TOutputTeacher, TOutputTeacherCustom, TTeacherJoin } from '../types';
import { IPaginateOutput } from 'src/common/interfaces';
import { QueryPaginationDto } from 'src/common/dto';
import { paginate, paginateOutput } from 'src/common/utils';
import { TPosition } from 'src/modules/teachers-config/types';
import { TDepartmentJoin } from 'src/modules/centers/types';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    // private readonly teachersUndergradService: TeachersUndergradService,
  ) {}

  // para crear un perfil de docente para un usuario ya creado, siempre y cuando el rol, sea: DOCENTE, COORDINADOR_CARRERA
  async create(createTeacherDto: CreateTeacherDto) {
    const {
      categoryId,
      contractTypeId,
      shiftId,
      userId,
      undergradId,
      postgradId,
      departmentId,
      positionId,
    } = createTeacherDto;

    const newTeacher = await this.prisma.teacher.create({
      data: {
        userId,
        categoryId,
        contractTypeId,
        shiftId,
        undergradDegrees: {
          create: [
            {
              undergraduate: { connect: { id: undergradId } },
            },
          ],
        },
        ...(postgradId
          ? {
              undergradDegrees: {
                create: [
                  {
                    undergraduate: { connect: { id: undergradId } },
                  },
                ],
              },
            }
          : {}),
        ...(positionId && departmentId
          ? {
              positionHeld: {
                create: [
                  {
                    position: { connect: { id: positionId } },
                    department: { connect: { id: departmentId } },
                  },
                ],
              },
            }
          : {}),
      },
    });

    return newTeacher;
  }

  async findAll(): Promise<TOutputTeacherCustom[]> {
    const teachers = await this.prisma.teacher.findMany({
      select: {
        id: true,
        categoryId: true,
        contractTypeId: true,
        shiftId: true,
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    // const mappedTeachers = teachers.map((teacher) => ({
    // id: teacher.id,
    // })

    const mappedTeachers: TOutputTeacherCustom[] = teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.user.name,
      code: teacher.user.code,
      categoryId: teacher.categoryId,
      contractTypeId: teacher.contractTypeId,
      shiftId: teacher.shiftId,
      userId: teacher.user.id,
    }));

    return mappedTeachers;
  }

  async findAllWithPagination(
    query: QueryPaginationDto,
  ): Promise<IPaginateOutput<TOutputTeacher>> {
    const [teachers, count] = await Promise.all([
      this.prisma.teacher.findMany({
        ...paginate(query),
        select: {
          id: true,
          categoryId: true,
          contractTypeId: true,
          shiftId: true,
          user: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          contractType: true,
          category: true,
          shift: true,
          postgraduateDegrees: {
            include: {
              postgraduate: true,
            },
          },
          undergradDegrees: {
            include: {
              undergraduate: true,
            },
          },
          positionHeld: {
            include: {
              department: {
                include: {
                  center: true,
                  faculty: true,
                },
              },
              position: true,
            },
          },
        },
      }),
      this.prisma.teacher.count(),
    ]);

    // const mappedTeachers = teachers.map((teacher) => ({
    // id: teacher.id,
    // })

    const mappedTeachers: TOutputTeacher[] = teachers.map((teacher) =>
      this.mapTeacher(teacher as TTeacherJoin),
    );

    return paginateOutput<TOutputTeacher>(mappedTeachers, count, query);
  }

  async findOne(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher)
      throw new NotFoundException(
        `El docente con id <${id}> no fue encontrado.`,
      );

    return teacher;
  }

  async findOneByUserId(userId: string): Promise<TOutputTeacher> {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        userId,
      },
      relationLoadStrategy: 'join',
      select: {
        id: true,
        categoryId: true,
        contractTypeId: true,
        shiftId: true,
        user: {
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
          },
        },
        contractType: true,
        category: true,
        shift: true,
        postgraduateDegrees: {
          include: {
            postgraduate: true,
          },
        },
        undergradDegrees: {
          include: {
            undergraduate: true,
          },
        },
        positionHeld: {
          include: {
            department: {
              include: {
                center: true,
                faculty: true,
              },
            },
            position: true,
          },
        },
      },
    });

    if (!teacher)
      throw new NotFoundException(
        `El docente con userId <${userId}> no fue encontrado.`,
      );

    return this.mapTeacher(teacher as TTeacherJoin);
  }

  // async findTeacherByUserId(userId: string) {
  //   const teacher = await this.prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //     select: {
  //       id: true,
  //       userId: true,
  //       shiftId: true,
  //       contractTypeId: true,
  //       categoryId: true,
  //     },
  //   });
  //
  //   if (!teacher)
  //     throw new NotFoundException(
  //       `El docente con userId <${userId}> no fue encontrado.`,
  //     );
  //
  //   return teacher;
  // }

  async findOneByCode(code: string) {
    const teacher = await this.prisma.user.findUnique({
      where: {
        code,
      },
      relationLoadStrategy: 'join',
      include: {
        // id: true,
        // name: true,
        teacher: {
          select: {
            id: true,
            userId: true,
            // positionHeld: {
            //   select: {
            //     departmentId: true,
            //   },
            // },
          },
        },
      },
    });

    if (!teacher || !teacher.teacher)
      throw new NotFoundException(
        `El docente con el código <${code}> no fue encontrado.`,
      );

    return {
      id: teacher.teacher.id,
      userId: teacher.id,
      name: teacher.name,
      code: teacher.code,
    };
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const { categoryId, contractTypeId, shiftId, undergradId, postgradId } =
      updateTeacherDto;

    await this.findOne(id);

    const teacherUpdate = await this.prisma.teacher.update({
      where: {
        id,
      },
      data: {
        categoryId,
        contractTypeId,
        shiftId,
      },
    });

    // Falta ver si manda un id en pregrado y postgrado.
    // Aunque al ser una tabla mtm, deberia el usuario seleccionar que quiere eliminar primero.

    return teacherUpdate;
  }

  // para no eliminarlo en su totalidad, asi quedan los registros.
  async remove(id: string): Promise<boolean> {
    const teacher = await this.findOne(id);
    const user = await this.usersService.findOne(teacher.userId);

    const deleteTeacher = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activeStatus: !user.activeStatus,
      },
    });

    return !!deleteTeacher;
  }

  private mapTeacher(teacher: TTeacherJoin):
    | TOutputTeacher
    | (TOutputTeacher & {
        positions: { department: TDepartmentJoin; position: TPosition }[];
      }) {
    return {
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email ?? undefined,
      code: teacher.user.code,
      categoryId: teacher.categoryId,
      contractTypeId: teacher.contractTypeId,
      shiftId: teacher.shiftId,
      userId: teacher.user.id,
      categoryName: teacher.category.name,
      contractTypeName: teacher.contractType.name,
      shiftName: teacher.shift.name,
      undergrads: teacher.undergradDegrees.map((u) => ({
        id: u.undergraduate.id,
        name: u.undergraduate.name,
      })),
      postgrads: teacher.postgraduateDegrees.map((u) => ({
        id: u.postgraduate.id,
        name: u.postgraduate.name,
      })),
      positions: teacher.positionHeld.map((ph) => ({
        ...ph,
        department: ph.department,
        position: ph.position,
      })),
    };
  }
}
