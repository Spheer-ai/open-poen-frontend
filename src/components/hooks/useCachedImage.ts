import { useMemo } from "react";

const imageCache = {};

const loadImage = (src) => {
  if (!imageCache[src]) {
    const img = new Image();
    img.src = src;
    imageCache[src] = img.src;
    console.log(`Loading image: ${src}`);
  } else {
    console.log(`Using cached image: ${src}`);
  }
  return imageCache[src];
};

const useCachedImage = (src) => {
  console.log(`Initializing hook for: ${src}`);
  const cachedSrc = useMemo(() => loadImage(src), [src]);
  return cachedSrc;
};

export default useCachedImage;
