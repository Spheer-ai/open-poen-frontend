import React, { useState, useRef } from "react";
import styles from "../../../assets/scss/ImageUploader.module.scss";

interface ImageUploaderProps {
  onImageUpload: (image: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onImageUpload(file);
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles["image-uploader-container"]} onClick={openFileInput}>
      <img src="/upload-image.svg" alt="Upload Image" />
      <h4>Zet uw bestanden hier neer</h4>
      <p>Blader door het bestand vanaf uw computer</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the file input
      />
      {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
    </div>
  );
};

export default ImageUploader;
