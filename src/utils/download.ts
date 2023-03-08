// import FileSaver from 'file-saver';
// import JSZip from 'jszip';

import { IFile } from '@/types';
const worker = new Worker('/download.js');
export const handleDownload = function (files: IFile[]) {
  if (files.length) {
    worker.postMessage(files);
  }

  worker.onmessage = function (wk) {
    const data = wk.data;
    const a = document.createElement('a');
    a.download = data.file.fileName;
    a.href = data.blob;
    a.click();
    window.URL.revokeObjectURL(data.blob);
  };
};
