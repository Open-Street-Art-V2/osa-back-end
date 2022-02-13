//import { Request } from 'express';
import { extname } from 'path';

export default function fileName(
  req: any,
  file: Express.Multer.File,
  callback,
) {
  console.log(req.body);
  const filename = file.originalname.split('.')[0].slice(0, 4);
  const extension = extname(file.originalname);
  file.filename = filename + new Date().getTime() + extension;
  if (!req.filenames) {
    req.filenames = [];
  }
  req.filenames.push(file.filename);
  callback(null, file.filename);
}
