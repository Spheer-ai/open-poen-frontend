// src/utils/images.ts
import imageHooks from "../hooks/imageHook";

const useCachedImages = (keys: Array<keyof typeof imageHooks>) => {
  const images: { [key: string]: string } = {};
  keys.forEach((key) => {
    if (imageHooks[key]) {
      images[key] = imageHooks[key]();
    }
  });
  return images;
};

export default useCachedImages;
