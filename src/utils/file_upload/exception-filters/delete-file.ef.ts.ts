import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { removePicturesFromFileSystem } from 'src/utils/file.utils';

@Catch(HttpException)
export default class CreateArtBadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse<Response>();
    if (req.filenames) {
      removePicturesFromFileSystem(req.filenames);
    }
    res.status(exception.getStatus()).json(exception.getResponse());
  }
}
