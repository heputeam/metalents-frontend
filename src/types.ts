export interface IRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface IFile {
  id?: number;
  userId?: number;
  fileUrl: string;
  fileThumbnailUrl?: string;
  fileName: string;
  fileSize: string;
  // fileType: `image/${string}` | `video/${string}`;
  fileType: string;
  type?: number; // 所属模块
}
