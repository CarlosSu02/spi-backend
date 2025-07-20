import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  // para crear un perfil de docente para un usuario ya creado, siempre y cuando el rol, sea: DOCENTE, COORDINADOR_CARRERA
  async create(createTeacherDto: CreateTeacherDto) {
    return 'This action adds a new teacher';
  }

  async findAll() {
    return `This action returns all teachers`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} teacher`;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  async remove(id: string) {
    return `This action removes a #${id} teacher`;
  }
}
