import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

//import fs from 'fs'; ---> Don't delete if you use it here
export const removePicturesFromFileSystem = (filenames: string[]) => {
  // remove pictures from the file system
  const fs = require('fs');

  try {
    filenames.map((filename) => {
      const path = `${process.env.IMAGE_DEST}/${filename}`;
      fs.unlink(path, (err) => {
        if (err) throw err;
        else console.log(`Deleted image : ${filename}`);
      });
    });
  } catch (err) {
    throw new HttpException(
      'Something went wrong',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const exceptionUploadFiles = (
  fileNames: string[],
  tabIndex: number,
): void => {
  switch (tabIndex) {
    case 1:

    case 2:

    case 3: {
      if (fileNames.length != 1)
        throw new BadRequestException('Wrong index/images provided');
      break;
    }
    case 4:
    case 5:
    case 6: {
      if (fileNames.length != 2)
        throw new BadRequestException('Wrong index/images provided');
      break;
    }
    case 7: {
      if (fileNames.length != 3)
        throw new BadRequestException('Wrong index/images provided');
      break;
    }
    default: {
      break;
    }
  }
};
