import React, { useState, useRef } from "react";
import styles from "../../../assets/scss/ImageUploader.module.scss";
import { uploadProfileImage } from "../../../components/middleware/Api";

interface ImageUploaderProps {
  onImageUpload: (image: File) => void;
  userId: string;
  token: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  userId,
  token,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadProfileImage(userId, file, token);
        setSelectedImage(file);
        onImageUpload(file);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
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
        style={{ display: "none" }}
      />
      {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
    </div>
  );
};

export default ImageUploader;
