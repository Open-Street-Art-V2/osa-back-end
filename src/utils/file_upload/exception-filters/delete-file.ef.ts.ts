import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { removePicturesFromFileSystem } from 'src/utils/file.utils';

@Catch(BadRequestException)
export default class CreateArtBadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    console.log(exception.getResponse());
    const req = host.switchToHttp().getRequest();
    const res = host.switchToHttp().getResponse<Response>();
    if (req.filenames) {
      removePicturesFromFileSystem(req.filenames);
    }
    res.status(exception.getStatus()).json(exception.getResponse());
  }
}
