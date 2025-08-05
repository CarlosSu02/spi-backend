import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  BadRequestException,
  PayloadTooLargeException,
  InternalServerErrorException,
} from '@nestjs/common';
import { multerConfig } from '../configs/multer.config';
import { CloudinaryService } from '../services/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EUserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators';

interface IResponse {
  url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  type: string;
}

@Controller('cloudinary')
@Roles(EUserRole.ADMIN)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('test')
  @ApiOperation({
    summary: 'Probar conexión con Cloudinary',
    description:
      'Este endpoint verifica que la conexión con el servicio de Cloudinary esté funcionando correctamente.',
  })
  @ApiOkResponse({
    description: 'Conexión con Cloudinary exitosa.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error al conectar con Cloudinary.',
  })
  async testConnection() {
    return await this.cloudinaryService.testConnection();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({
    summary: 'Subir archivo a Cloudinary',
    description:
      'Este endpoint permite subir un archivo a Cloudinary, asociándolo a un código de usuario y un subject específicos.',
  })
  @ApiBody({
    required: true,
    description: 'Información necesaria para subir un archivo.',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Código del usuario a guardar la imagen',
        },
        subject: {
          type: 'string',
          description: 'Subject donde guardar la imagen',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['code', 'subject', 'file'],
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
  @ApiCreatedResponse({
    description: 'Archivo subido correctamente.',
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida, falta algún campo o el archivo no es válido.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno al subir el archivo.',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('code') code: string,
    @Body('subject') subject: string,
  ): Promise<IResponse> {
    console.log(code);
    try {
      if (!file)
        throw new BadRequestException('No se proporcionó ningun archivo');

      const uploadResult = (await this.cloudinaryService.uploadFile(
        file.buffer,
        code,
        subject,
        file.originalname,
        file.mimetype,
      )) as UploadApiResponse;

      return {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        resource_type: uploadResult.resource_type,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        type: uploadResult.resource_type === 'image' ? 'image' : 'document',
      };
    } catch (error) {
      if (error.message.includes('File size too large')) {
        throw new PayloadTooLargeException(
          'El archivo excede el tamaño máximo permitido de 10MB',
        );
      }

      throw new BadRequestException(`Error al subir archivo: ${error.message}`);
    }
  }

  @Get('files/:code/:subject')
  @ApiOperation({
    summary: 'Obtener archivos por carpeta',
    description:
      'Recupera los archivos almacenados en Cloudinary según el código de usuario y el subject especificado.',
  })
  @ApiOkResponse({
    description: 'Lista de archivos obtenida correctamente.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontraron archivos para el código y subject especificados.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor.',
  })
  async getFilesByFolder(
    @Param('code') code: string,
    @Param('subject') subject: string,
  ) {
    try {
      return await this.cloudinaryService.getFilesByFolder(code, subject);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error interno del servidor al obtener los archivos',
      );
    }
  }

  @Get('search/:code')
  @ApiOperation({
    summary: 'Buscar archivos por usuario',
    description:
      'Busca archivos en Cloudinary asociados al código de usuario proporcionado, usando un término de búsqueda opcional.',
  })
  @ApiOkResponse({
    description: 'Archivos encontrados según el término de búsqueda.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontraron archivos que coincidan con la búsqueda.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor.',
  })
  async searchFilesByUser(
    @Param('code') code: string,
    @Query('q') searchTerm: string,
  ) {
    try {
      if (!searchTerm) {
        throw new BadRequestException('Término de búsqueda requerido');
      }

      return await this.cloudinaryService.searchFilesByUserAndTerm(
        code,
        searchTerm,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error interno del servidor al subir archivo',
      );
    }
  }
}
