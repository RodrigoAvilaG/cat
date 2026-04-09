import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import 'multer';

@Injectable()
export class CloudinaryService {
  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'saas-catalog' }, // 🔥 Cloudinary creará esta carpeta para tener todo ordenado
        (error, result) => {
          if (error) return reject(error);
          // Si Typescript se queja de que result puede ser undefined, le forzamos la aserción
          resolve(result as UploadApiResponse); 
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}