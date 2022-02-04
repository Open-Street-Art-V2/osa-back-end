import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';

export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  console.log(req.body);
  if (!extname(file.originalname).match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new HttpException(
        'Image format not allowed, please choose either jpg, jpeg or png',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
