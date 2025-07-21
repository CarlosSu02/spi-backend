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
      },
    });

    return newTeacher;
  }

  async findAll() {
    const teachers = await this.prisma.teacher.findMany();

    return teachers;
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

  async findOneByUserId(userId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        shiftId: true,
        contractTypeId: true,
        categoryId: true,
      },
    });

    if (!teacher)
      throw new NotFoundException(
        `El docente con userId <${userId}> no fue encontrado.`,
      );

    return teacher;
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
}
