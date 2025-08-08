import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import {
  Roles,
  ResponseMessage,
  ApiPagination,
  GetCurrentUserId,
} from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateVerificationMediaDto, UpdateVerificationMediaDto } from '../dto';
import { VerificationMediasService } from '../services/verification-medias.service';
import { QueryPaginationDto } from 'src/common/dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/modules/cloudinary/configs/multer.config';

@Controller('verification-medias')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
  EUserRole.DOCENTE,
)
export class VerificationMediasController {
  constructor(
    private readonly verificationMediasService: VerificationMediasService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, multerConfig))
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Se ha creado un medio de verificación.')
  @ApiOperation({
    summary: 'Crear un medio de verificación',
    description:
      'Debería crear un nuevo medio de verificación con o sin archivos adjuntos.',
  })
  @ApiBody({
    required: true,
    // description: 'Información necesaria para subir un archivo.',
    description: 'Datos necesarios para crear un medio de verificación.',
    schema: {
      type: 'object',
      properties: {
        description: {
          description:
            'Descripción del medio de verificación, si no se mandan archivos solamente se guardará la descripción.',
          type: 'string',
          format: 'string',
        },
        activityId: {
          description:
            'ID de la actividad complemenetaria a la que pertenece este medio de verificación.',
          type: 'string',
          format: 'uuid',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description:
            'Archivos a adjuntar, opcional y múltiples (solamente 5).',
        },
      },
      required: ['description', 'activityId'],
    },
  })
  // @ApiQuery({
  //   name: 'code',
  //   description: 'Código del usuario a guardar la imagen.',
  //   type: String,
  //   required: true,
  // })
  // @ApiQuery({
  //   name: 'subject',
  //   description: 'Subject donde guardar la imagen.',
  //   type: String,
  //   required: true,
  // })
  @ApiConsumes('multipart/form-data')
  create(
    @Body()
    createVerificationMediaDto: CreateVerificationMediaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.verificationMediasService.create(
      createVerificationMediaDto,
      files,
    );
  }

  // @Post('upload')
  // @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  // @HttpCode(HttpStatus.CREATED)
  // @ResponseMessage(
  //   'Se ha creado un medio de verificación para el usuario autenticado.',
  // )
  // @ApiOperation({
  //   summary: 'Crear un medio de verificación para el usuario autenticado',
  //   description:
  //     'Debería crear un nuevo medio de verificación para el usuario autenticado.',
  // })
  // @ApiBody({
  //   type: CreateVerificationMediaDto,
  //   description: 'Datos necesarios para crear un medio de verificación.',
  // })
  // createPersonal(
  //   @Body()
  //   createVerificationMediaDto: CreateVerificationMediaDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.verificationMediasService.create(
  //     createVerificationMediaDto,
  //     file,
  //   );
  // }

  @Get()
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Listado de tipos de actividades.')
  @ApiOperation({
    summary: 'Obtener todos los tipos de actividades',
    description: 'Devuelve una lista de todos los tipos de actividades.',
  })
  @ApiPagination({
    summary: 'Obtener todos los medios de verificación',
    description: 'Devuelve una lista de todos los medios de verificación.',
  })
  findAll(@Query() query: QueryPaginationDto) {
    return this.verificationMediasService.findAllWithPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('La información del medio de verificación.')
  @ApiOperation({
    summary: 'Obtener un medio de verificación por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del medio de verificación a obtener',
    type: String,
    format: 'uuid',
  })
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.verificationMediasService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha actualizado el medio de verificación.')
  @ApiOperation({
    summary: 'Actualizar un medio de verificación por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del medio de verificación a actualizar',
    type: String,
    format: 'uuid',
  })
  update(
    @Param(ValidateIdPipe) id: string,
    @Body()
    updateVerificationMediaDto: UpdateVerificationMediaDto,
  ) {
    return this.verificationMediasService.update(
      id,
      updateVerificationMediaDto,
    );
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado un medio de verificación.')
  @ApiOperation({
    summary: 'Eliminar un medio de verificación por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del medio de verificación a eliminar',
    type: String,
    format: 'uuid',
  })
  remove(@Param(ValidateIdPipe) id: string) {
    return this.verificationMediasService.remove(id);
  }

  @Delete('file/:id')
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Se ha eliminado un archivo de los medios de verificación.')
  @ApiOperation({
    summary: 'Eliminar un archivo de un medio de verificación por ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del archivo del medio de verificación a eliminar',
    type: String,
    format: 'uuid',
  })
  removeFile(@Param(ValidateIdPipe) id: string) {
    return this.verificationMediasService.removeFile(id);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Se ha eliminado un medio de verificación (usuario autenticado).',
  )
  @ApiOperation({
    summary: 'Eliminar un medio de verificación por ID (usuario autenticado)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del medio de verificación a eliminar',
    type: String,
    format: 'uuid',
  })
  removePersonal(
    @GetCurrentUserId() currentUserId: string,
    @Param(ValidateIdPipe) id: string,
  ) {
    return this.verificationMediasService.removePersonal(currentUserId, id);
  }

  @Delete('file/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Se ha eliminado un archivo de los medios de verificación (usuario autenticado).',
  )
  @ApiOperation({
    summary:
      'Eliminar un archivo de un medio de verificación por ID (usuario autenticado)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del archivo del medio de verificación a eliminar',
    type: String,
    format: 'uuid',
  })
  removeFilePersonal(
    @GetCurrentUserId() currentUserId: string,
    @Param(ValidateIdPipe) id: string,
  ) {
    return this.verificationMediasService.removeFilePersonal(currentUserId, id);
  }
}
