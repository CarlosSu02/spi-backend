import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDepartmentPositionDto } from '../dto/create-teacher-department-position.dto';
import { UpdateTeacherDepartmentPositionDto } from '../dto/update-teacher-department-position.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TTeacherDeptPos } from '../types';
import { TeachersService } from 'src/modules/teachers/services/teachers.service';
import { getTime, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

@Injectable()
export class TeacherDepartmentPositionService {
  private readonly selectOptionsTDP = {
    id: true,
    startDate: true,
    endDate: true,
    teacher: {
      select: {
        id: true,
        user: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    },
    position: {
      select: {
        id: true,
        name: true,
      },
    },
    department: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    createTeacherDepartmentPositionDto: CreateTeacherDepartmentPositionDto,
  ): Promise<TTeacherDeptPos> {
    const { userId, departmentId, positionId, startDate } =
      createTeacherDepartmentPositionDto;

    const teacher = await this.teachersService.findOneByUserId(userId);

    // primero obtener el primer dato, ya que un docente solo puede tener un cargo en el mismo departamento
    const teacherDeptPosExists =
      await this.prisma.teacher_Department_Position.findFirst({
        where: {
          AND: [
            {
              teacherId: teacher.id,
            },
            { departmentId: departmentId },
          ],
        },
        select: {
          endDate: true,
        },
      });

    if (teacherDeptPosExists && teacherDeptPosExists.endDate === null)
      throw new BadRequestException(
        'El docente ya cuenta con un cargo académico en este departamento y se encuentra activo.',
      );

    const newTeacherDeptPos =
      await this.prisma.teacher_Department_Position.create({
        data: {
          teacherId: teacher.id,
          departmentId,
          positionId,
          startDate: parseISO(startDate),
        },
      });

    return newTeacherDeptPos;
  }

  async findAll(): Promise<TTeacherDeptPos[]> {
    const teacherDeptPos =
      await this.prisma.teacher_Department_Position.findMany({
        // Se puede usar include tambien...
        select: this.selectOptionsTDP,
      });

    // if (teacherDeptPoss.length === 0)
    //   throw new NotFoundException('No se encontraron datos.'); // tambien se puede devolver un 200 como consulta exitosa pero con data []

    return teacherDeptPos;
  }

  async findOne(id: string): Promise<TTeacherDeptPos> {
    const teacherDeptPos =
      await this.prisma.teacher_Department_Position.findUnique({
        where: {
          id,
        },
        select: this.selectOptionsTDP,
      });

    if (!teacherDeptPos)
      throw new NotFoundException(
        `El <docente-departamente-cargo> con id <${id}> no fue encontrado.`,
      );

    return teacherDeptPos;
  }

  async findOneByTeacherCodeAndDepartmentId(
    teacherCode: string,
    departmentId: string,
  ): Promise<TTeacherDeptPos | null> {
    const teacher = await this.teachersService.findOneByCode(teacherCode);

    const teacherDeptPosExists =
      await this.prisma.teacher_Department_Position.findFirst({
        where: {
          AND: [
            {
              teacherId: teacher.id,
            },
            { departmentId: departmentId },
          ],
        },
        select: {
          id: true,
          teacherId: true,
          departmentId: true,
          startDate: true,
          endDate: true,
        },
      });

    return teacherDeptPosExists;
  }

  async update(
    id: string,
    updateTeacherDepartmentPositionDto: UpdateTeacherDepartmentPositionDto,
  ): Promise<TTeacherDeptPos> {
    const teacherDeptPos = await this.findOne(id);
    const { endDate } = updateTeacherDepartmentPositionDto;

    if (endDate) {
      updateTeacherDepartmentPositionDto.endDate =
        parseISO(endDate).toISOString();

      if (getTime(endDate) < getTime(teacherDeptPos.startDate))
        throw new BadRequestException(
          `La fecha de finalización ingresada <${endDate}> no debe ser menor a la fecha de inicio <${formatInTimeZone(teacherDeptPos.startDate, 'America/Tegucigalpa', 'yyyy-MM-dd HH:mm:ss')}>, por favor agregue una fecha válida.`,
        );
    }

    const teacherDeptPosUpdate =
      await this.prisma.teacher_Department_Position.update({
        where: {
          id,
        },
        data: {
          ...updateTeacherDepartmentPositionDto,
        },
      });

    return teacherDeptPosUpdate;
  }

  async remove(id: string): Promise<TTeacherDeptPos> {
    const teacherDeptPosDelete =
      await this.prisma.teacher_Department_Position.delete({
        where: {
          id,
        },
      });

    return teacherDeptPosDelete;
  }
}
