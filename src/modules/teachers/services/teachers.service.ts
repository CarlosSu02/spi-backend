import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeachersUndergradService } from 'src/modules/teachers-undergrad/services/teachers-undergrad.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class TeachersService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly teachersUndergradService: TeachersUndergradService,
  ) {}

  // para crear un perfil de docente para un usuario ya creado, siempre y cuando el rol, sea: DOCENTE, COORDINADOR_CARRERA
  async create(createTeacherDto: CreateTeacherDto | CreateUserDto) {
    console.log(createTeacherDto);

    // Primero se creara el perfil de docente
    // const newTeacher = await this.prisma.teacher.create({
    //
    // })

    return 'This action adds a new teacher';
  }

  async findAll() {
    return `This action returns all teachers`;
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
    return `This action updates a #${id} teacher`;
  }

  async remove(id: string) {
    return `This action removes a #${id} teacher`;
  }
}
