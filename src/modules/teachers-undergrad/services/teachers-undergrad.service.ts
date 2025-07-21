import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeacherUndergradDto } from '../dto';
import { TeachersService } from 'src/modules/teachers/services/teachers.service';

@Injectable()
export class TeachersUndergradService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teachersService: TeachersService,
  ) {}

  async create(
    createTeacherUndergradDto: CreateTeacherUndergradDto,
  ): Promise<any> {
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

  async findAll() {
    const results = await this.prisma.teacherUndergraduateDegree.findMany({
      relationLoadStrategy: 'join',
      include: {
        teacher: true,
        undergraduate: true,
      },
    });

    return results;
  }
}
