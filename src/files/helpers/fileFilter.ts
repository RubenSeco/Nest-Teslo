export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {

  // console.log({ file });
  if (!file) return callback(new Error('No file provided'), false);
  const fileException = file.mimetype.split("/")[1];
  const validExtensions = ["jpg", "jpeg", "png", "gif"];
  if (validExtensions.includes(fileException)) {
    return callback(null, true);
  }

  callback(null, false);

};