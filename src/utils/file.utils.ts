import { HttpException, HttpStatus } from '@nestjs/common';

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
): boolean => {
  switch (tabIndex) {
    case 1:

    case 2:

    case 3: {
      return fileNames.length == 1;
    }
    case 4:
    case 5:
    case 6: {
      return fileNames.length == 2;
    }
    case 7: {
      return fileNames.length == 3;
    }
    default: {
      return false;
    }
  }
};
