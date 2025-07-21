import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeacherUndergradDto } from '../dto';
import { TeachersService } from 'src/modules/teachers/services/teachers.service';
import { TTeacherUndergrad } from '../types';

@Injectable()
export class TeachersUndergradService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    createTeacherUndergradDto: CreateTeacherUndergradDto,
  ): Promise<TTeacherUndergrad> {
    const { userId, undergradId: undergraduateId } = createTeacherUndergradDto;

    const teacher = await this.teachersService.findOneByUserId(userId);

    const newTeacherUndergrad =
      await this.prisma.teacherUndergraduateDegree.create({
        data: {
          teacherId: teacher.id,
          undergraduateId,
        },
      });

    return newTeacherUndergrad;
  }

  async findAll(): Promise<TTeacherUndergrad[]> {
    const results = await this.prisma.teacherUndergraduateDegree.findMany({
      relationLoadStrategy: 'join',
      include: {
        teacher: true,
        undergraduate: true,
      },
    });

    return results;
  }

  async remove(userId: string, undergradId: string): Promise<boolean> {
    const teacher = await this.teachersService.findOneByUserId(userId);

    const deleteTeacherUndergrad =
      await this.prisma.teacherUndergraduateDegree.delete({
        where: {
          teacherId_undergraduateId: {
            teacherId: teacher.id,
            undergraduateId: undergradId,
          },
        },
      });

    return !!deleteTeacherUndergrad;
  }
}
