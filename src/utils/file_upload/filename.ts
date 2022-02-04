import { Request } from 'express';
import { extname } from 'path';

export default function fileName(
  req: Request,
  file: Express.Multer.File,
  callback,
) {
  console.log(req.body);
  const filename = file.originalname.split('.')[0].slice(0, 4);
  const extension = extname(file.originalname);
  file.filename = filename + new Date().getTime() + extension;
  callback(null, file.filename);
}
