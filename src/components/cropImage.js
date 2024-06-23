// cropImage.js
const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });
  
  function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
  }
  
  export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const maxSize = Math.max(image.width, image.height);
    canvas.width = maxSize;
    canvas.height = maxSize;
  
    ctx.translate(maxSize / 2, maxSize / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
  
    const data = ctx.getImageData(0, 0, maxSize, maxSize);
  
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  
    ctx.putImageData(
      data,
      -maxSize / 2 + pixelCrop.x,
      -maxSize / 2 + pixelCrop.y
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(URL.createObjectURL(file));
      }, 'image/jpeg');
    });
  }
  