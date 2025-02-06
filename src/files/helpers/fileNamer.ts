import { v4 as uuid } from "uuid";

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: string) => void) => {

  // console.log({ file });
  if (!file) return callback(new Error('No file provided'), "");

  const fileExtension = file.mimetype.split("/")[1];

  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);

};