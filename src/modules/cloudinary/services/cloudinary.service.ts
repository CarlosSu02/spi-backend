import { Readable } from 'stream';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
  UploadApiOptions,
} from 'cloudinary';
import {
  TCloudinaryResource,
  TCloudinaryResponse,
  TFileResponse,
} from '../types';

// interface IFileResponse {
//   public_id: string;
//   url: string;
//   width?: number;
//   height?: number;
//   format?: string;
//   resource_type: string;
//   bytes: number;
//   created_at: string;
//   type: string;
// }

@Injectable()
export class CloudinaryService {
  private MAX_RESULTS: number = 100;

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private getResourceType(mimetype: string): 'image' | 'raw' {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else {
      return 'raw'; // documentos
    }
  }

  async testConnection() {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 1,
      });

      return {
        status: 'success',
        message: 'Conexión exitosa',
        totalResources: result.total_count,
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    code: string,
    subject: string,
    filename: string,
    mimetype: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!code || !subject)
      throw new BadRequestException(
        'Revise el <code> o <subject> estos no pueden estar vacíos.',
      );

    const timestamp = Date.now();
    const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
    const extension = filename.split('.').pop();
    const fileName = `${nameWithoutExt}-${timestamp}`;
    const resourceType = this.getResourceType(mimetype);
    const folder = `${code}/${subject}`;

    return new Promise((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        folder: folder,
        public_id: fileName,
        resource_type: resourceType,
        overwrite: false,
        use_filename: false,
        unique_filename: false,
        invalidate: true,
      };

      if (resourceType === 'raw') {
        uploadOptions.format = extension;
      }

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            return reject(
              new BadRequestException(
                `Error al subir archivo: ${error.message}`,
              ),
            );
          }

          if (!result) {
            return reject(
              new BadRequestException('No se recibió resultado de Cloudinary'),
            );
          }

          resolve(result);
        },
      );

      Readable.from(fileBuffer).pipe(stream);
    });
  }

  async getFilesByFolder(code: string, subject: string) {
    try {
      const folderPath = `${code}/${subject}`;
      const [images, documents] = await Promise.all([
        this.getImages(folderPath),
        this.getFiles(folderPath),
      ]);

      const allFiles = [
        ...images.resources.map((resource) => ({
          ...this.formatFileResponse(resource),
          type: 'image',
        })),
        ...documents.resources.map((resource) => ({
          ...this.formatFileResponse(resource),
          type: 'document',
        })),
      ];

      if (allFiles.length === 0) {
        throw new BadRequestException(
          'No se encontraron archivos en el directorio especificado',
        );
      }

      return allFiles.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al obtener archivos: ${error.message}`,
      );
    }
  }

  async searchFilesByUserAndTerm(code: string, searchTerm: string) {
    try {
      const [images, documents] = await Promise.all([
        this.getImages(code, 500),
        this.getFiles(code, 500),
      ]);

      const filteredImages = images.resources.filter((resource) =>
        resource.public_id.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      const filteredDocuments = documents.resources.filter((resource) =>
        resource.public_id.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      const allFiles = [
        ...filteredImages.map((resource) => ({
          ...this.formatFileResponse(resource),
          type: 'image',
        })),
        ...filteredDocuments.map((resource) => ({
          ...this.formatFileResponse(resource),
          type: 'document',
        })),
      ];

      if (allFiles.length === 0) {
        throw new BadRequestException(
          'No se encontraron archivos con el término indicado',
        );
      }

      return allFiles.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } catch (error) {
      throw new BadRequestException(
        `Error en la busqueda por usuario y archivo: ${error.message}`,
      );
    }
  }

  private formatFileResponse(resource: TCloudinaryResource): TFileResponse {
    return {
      public_id: resource.public_id,
      url: resource.secure_url,
      width: resource.width || undefined, // no se muestran en el objeto
      height: resource.height || undefined,
      format: resource.format || undefined,
      resource_type: resource.resource_type,
      bytes: resource.bytes,
      created_at: resource.created_at,
      type: resource.type,
    };
  }

  private async getImages(
    prefix: string,
    max_results: number = this.MAX_RESULTS,
  ): Promise<TCloudinaryResponse> {
    try {
      return await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
        prefix,
        max_results,
      });
    } catch (error) {
      throw new BadRequestException(
        `Error al obtener archivos: ${error.message}`,
      );
    }
  }

  private async getFiles(
    prefix: string,
    max_results: number = this.MAX_RESULTS,
  ): Promise<TCloudinaryResponse> {
    try {
      return await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'raw',
        prefix,
        max_results,
      });
    } catch (error) {
      throw new BadRequestException(
        `Error al obtener archivos: ${error.message}`,
      );
    }
  }
}
