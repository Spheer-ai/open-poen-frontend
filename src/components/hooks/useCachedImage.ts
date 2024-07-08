import { useMemo } from "react";

const imageCache: { [key: string]: string } = {};

const loadImage = (src: string, caller: string | undefined) => {
  if (!imageCache[src]) {
    const img = new Image();
    img.src = src;
    imageCache[src] = img.src;
    console.log(`Initializing hook for: ${src} by ${caller}`);
  } else {
    console.log(`Using cached image: ${src} by ${caller}`);
  }
  return imageCache[src];
};

const useCachedImage = (src: string) => {
  let caller: string | undefined;
  try {
    const stack = new Error().stack;
    if (stack) {
      const stackLines = stack.split("\n");
      if (stackLines.length > 2) {
        caller = stackLines[2].trim();
      }
    }
  } catch (error) {
    console.error("Error retrieving stack trace:", error);
  }

  const cachedSrc = useMemo(() => loadImage(src, caller), [src]);
  return cachedSrc;
};

export default useCachedImage;
