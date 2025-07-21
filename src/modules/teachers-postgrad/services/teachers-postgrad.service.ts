import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersService } from 'src/modules/teachers/services/teachers.service';
import { TTeacherPostgrad } from '../types';
import { CreateTeacherPostgradDto } from '../dto';

@Injectable()
export class TeachersPostgradService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    createTeacherPostgradDto: CreateTeacherPostgradDto,
  ): Promise<TTeacherPostgrad> {
    const { userId, postgradId: postgraduateId } = createTeacherPostgradDto;

    const teacher = await this.teachersService.findOneByUserId(userId);

    const newTeacherPostgrad =
      await this.prisma.teacherPostgraduateDegree.create({
        data: {
          teacherId: teacher.id,
          postgraduateId,
        },
      });

    return newTeacherPostgrad;
  }

  async findAll(): Promise<TTeacherPostgrad[]> {
    const results = await this.prisma.teacherPostgraduateDegree.findMany({
      relationLoadStrategy: 'join',
      include: {
        teacher: true,
        postgraduate: true,
      },
    });

    return results;
  }

  async remove(userId: string, postgradId: string): Promise<boolean> {
    const teacher = await this.teachersService.findOneByUserId(userId);

    const deleteTeacherPostgrad =
      await this.prisma.teacherPostgraduateDegree.delete({
        where: {
          teacherId_postgraduateId: {
            teacherId: teacher.id,
            postgraduateId: postgradId,
          },
        },
      });

    return !!deleteTeacherPostgrad;
  }
}
