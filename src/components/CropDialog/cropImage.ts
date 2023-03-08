export const createImage = (url: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<Blob | null> {
  const image: any = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/png');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (file) => {
        // resolve(URL.createObjectURL(file as Blob));
        resolve(file as Blob);
      },
      'image/webp',
      0.8,
    );
  });
}

export const getObjectURL = (file: File | null) => {
  // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
  if (!file) {
    return null;
  }
  if (window.createObjectURL) {
    return window.createObjectURL(file);
  }
  if (window.URL) {
    return window.URL.createObjectURL(file);
  }
  if (window.webkitURL) {
    return window.webkitURL.createObjectURL(file);
  }

  return null;
};

// 将url转换为base64
const getBase64Image = (img: HTMLImageElement) => {
  var demoCanvas = document.createElement('canvas');
  demoCanvas.width = img.width;
  demoCanvas.height = img.height;
  var ctx = demoCanvas.getContext('2d');
  ctx?.drawImage(img, 0, 0, 300, 150);
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
  var dataURL = demoCanvas.toDataURL('image/' + ext);
  return {
    dataURL: dataURL,
    type: 'image/' + ext,
  };
};

//将base64转换为file文件
const dataURLtoFile = (
  dataurl: { dataURL: string; type: string },
  filename: string,
) => {
  var arr = dataurl.dataURL.split(','),
    mime = (arr[0].match(/:(.*?);/) as any)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const fileProcess = async (fileUrl: string, filename: string) => {
  var demoImg = document.createElement('img');
  demoImg.src = fileUrl;
  var img = fileUrl;
  var image = new Image();
  // 给img加上随机值一部分情况下能解决跨域
  // image.src = img + '?time=' + new Date().valueOf();
  image.src = img;
  // 允许跨域操作
  image.setAttribute('crossOrigin', 'anonymous');

  var base64 = getBase64Image(image);
  var newFile = dataURLtoFile(base64, filename);

  return newFile;
  // image.onload = function () {

  // }
};
