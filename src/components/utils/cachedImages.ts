// src/utils/cachedImages.js
import useCachedImage from "../hooks/useCachedImage";
import imagePaths from "./imagePaths";

const cachedImages = {};
for (const [key, value] of Object.entries(imagePaths)) {
  cachedImages[key] = useCachedImage(value);
}

export default cachedImages;
