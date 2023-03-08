export const IMAGE_FILES_MIMES: string[] = [
  'image/png',
  'image/jpeg',
  'image/jp2', // .jpeg200
  'image/jpm', // .jpeg200
  'image/gif',
  'image/webp',
];

export const VIDEO_FILES_MIMES: string[] = [
  'video/x-msvideo', // .avi
  'video/mpeg',
  'video/mp4',
  'video/ogg', // .ogv
  'video/mp2t', // .ts
  'video/webm', // .webm
];

export const AUDIO_FILES_MIMES: string[] = [
  'audio/aac',
  'audio/mp3',
  'audio/mpeg', // .mp3
  'audio/ogg',
  'audio/wav',
  'audio/webm', // .weba
];

export enum FileAcceptType {
  'gif' = 'image/gif',
  'jpg' = 'image/jpeg',
  'jpeg' = 'image/jpeg',
  'png' = 'image/png',
  'webp' = 'image/webp',

  'avi' = 'video/x-msvideo',
  'mpeg' = 'video/mpeg',
  'webm' = 'video/webm',
  'mp4' = 'video/mp4',

  'mp3' = 'audio/mpeg',
  'wav' = 'audio/wav',
  'weba' = 'audio/webm',
}
