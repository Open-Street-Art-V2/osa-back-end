import { HttpException, HttpStatus } from "@nestjs/common";

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
  }