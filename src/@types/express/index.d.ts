import { User } from "@database/entity/User";

interface IFile {
  key: string;
  path: string;
  mimetype: string;
  originalname: string;
  size: number;
  location: string;
  fieldname: string;
  encoding: string;
  bucket: string;
  acl: string;
  contentType: string;
  contentDisposition?: string;
  contentEncoding?: string;
  storageClass: string;
  serverSideEncryption?: string;
  metadata?: object;
  etag: string;
  versionId?: number;
}
declare module "express-serve-static-core" {
  interface Request {
    user: User;
    file: IFile;
    files: Array<IFile>;
  }
}