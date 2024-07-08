import { useMemo } from "react";
import useCachedImage from "../hooks/useCachedImage";
import imagePaths, { ImagePaths } from "./imagePaths";

const useCachedImages = (): Partial<ImagePaths> => {
  const cachedImages = useMemo(() => {
    const images: Partial<ImagePaths> = {};
    for (const key in imagePaths) {
      if (imagePaths.hasOwnProperty(key)) {
        images[key] = useCachedImage(imagePaths[key]);
      }
    }
    return images;
  }, []);

  return cachedImages;
};

export default useCachedImages;
