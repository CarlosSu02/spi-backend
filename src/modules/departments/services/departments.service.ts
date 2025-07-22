import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TDepartment } from '../types';

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
