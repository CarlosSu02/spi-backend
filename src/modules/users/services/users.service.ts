import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TUser } from '../types';
import { RolesService } from './roles.service';
import * as argon from 'argon2';
import { EUserRole } from 'src/common/enums';
import { TeachersUndergradService } from 'src/modules/teachers-undergrad/services/teachers-undergrad.service';
import { TeachersService } from 'src/modules/teachers/services/teachers.service';

@Injectable()
export class UsersService {
  private readonly selectPropsUser = {
    id: true,
    name: true,
    code: true,
    email: true,
    activeStatus: true,
    // roleId: true,
    role: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly roleService: RolesService,
    private readonly teachersService: TeachersService,
    private readonly teachersUndergradService: TeachersUndergradService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const {
      name,
      code,
      email,
      password,
      passwordConfirm,
      role,
      categoryId,
      contractTypeId,
      shiftId,
      undergradId,
    } = createUserDto;

    if (passwordConfirm !== password)
      throw new BadRequestException(
        'La contraseña <password> y la contraseña de confirmación <passwordConfirm> deben coincidir.',
      );

    const hash = await argon.hash(password);

    const roleExists = await this.roleService.findOneByName(role);

    const baseData = {
      name,
      code,
      email,
      hash,
      roleId: roleExists.id,
    };

    const data = [EUserRole.COORDINADOR_AREA, EUserRole.DOCENTE].includes(
      roleExists.name as EUserRole,
    )
      ? {
          ...baseData,
          teachers: {
            create: [
              {
                category: { connect: { id: categoryId } },
                contractType: { connect: { id: contractTypeId } },
                shift: { connect: { id: shiftId } },
              },
            ],
          },
        }
      : baseData;

    const newUser = await this.prisma.user.create({
      data,
    });
    //   .catch((err) => {
    //     if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //       if (err.code === EPrismaClientErrors.UNIQUE.toString())
    //         throw new ForbiddenException('Credentials incorrect!');
    //     }
    //
    //     throw err;
    //   });
    // .catch((err) => console.log(err));

    if (!newUser) throw new BadRequestException('Error al crear el usuario.');

    if (
      [EUserRole.COORDINADOR_AREA, EUserRole.DOCENTE].includes(
        roleExists.name as EUserRole,
      ) &&
      undergradId
    ) {
      await this.teachersUndergradService.create({
        userId: newUser.id,
        undergradId,
      });
    }

    return newUser;
  }

  async findAll(): Promise<TUser[]> {
    const users = await this.prisma.user.findMany({
      select: this.selectPropsUser,
    });

    // if (users.length === 0)
    //   throw new NotFoundException('No se encontraron datos.'); // tambien se puede devolver un 200 como consulta exitosa pero con data []

    return users;
  }

  async findOne(id: string): Promise<TUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: this.selectPropsUser,
    });

    if (!user)
      throw new NotFoundException(
        `El usuario con id <${id}> no fue encontrado.`,
      );

    return user;
  }

  async findAllUsersWithRole(roleId: string): Promise<TUser[]> {
    await this.roleService.findOne(roleId);

    // const roleExists = await this.prisma.role.findUnique({
    //   where: {
    //     id: roleId,
    //   },
    // });
    //
    // if (!roleExists)
    //   throw new NotFoundException(
    //     `El rol con id <${roleId}> no fue encontrado.`,
    //   );

    const users = await this.prisma.user.findMany({
      where: {
        roleId,
      },
      select: this.selectPropsUser,
    });

    // if (users.length === 0)
    //   throw new NotFoundException('No se encontraron datos.'); // tambien se puede devolver un 200 como consulta exitosa pero con data []

    return users;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<TUser> {
    const { name, code, email, password, role, activeStatus } = updateUserDto;

    const userUpdate = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        code,
        email,
        hash: password && (await argon.hash(password)),
        roleId: role && (await this.roleService.findOneByName(role)).id,
        activeStatus,
      },
      select: this.selectPropsUser,
    });

    return userUpdate;
  }

  async remove(id: string): Promise<boolean> {
    const deleteUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return !!deleteUser;
  }
}
