import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { UpdateClassroomDto } from '../dto/update-classroom.dto';
import { TClassroom, TCreateClassroom, TUpdateClassroom } from '../types';

@Injectable()
export class ClassroomService {
  constructor(private prisma: PrismaService) {}

  async create(
    createClassroomDto: CreateClassroomDto,
  ): Promise<TCreateClassroom> {
    const newClassroom = await this.prisma.classroom.create({
      data: {
        ...createClassroomDto,
      },
    });

    return newClassroom;
  }

  async findAll(): Promise<TClassroom[]> {
    const classrooms = await this.prisma.classroom.findMany();

    return classrooms;
  }

  async findOne(id: string): Promise<TClassroom> {
    const classroom = await this.prisma.classroom.findUnique({
      where: {
        id,
      },
    });

    if (!classroom)
      throw new NotFoundException(`El aula con id <${id}> no fue encontrado.`);

    return classroom;
  }

  async update(
    id: string,
    updateClassroomDto: UpdateClassroomDto,
  ): Promise<TUpdateClassroom> {
    const classroomUpdate = await this.prisma.classroom.update({
      where: {
        id,
      },
      data: {
        ...updateClassroomDto,
      },
    });

    return classroomUpdate;
  }

  async remove(id: string): Promise<TClassroom> {
    const classroomDelete = await this.prisma.classroom.delete({
      where: {
        id,
      },
    });

    return classroomDelete;
  }
}
