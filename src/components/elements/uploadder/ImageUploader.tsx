import React, { useState, useRef } from "react";
import styles from "../../../assets/scss/ImageUploader.module.scss";
import { uploadProfileImage } from "../../../components/middleware/Api";
import useCachedImages from "../../utils/images";

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
  const [isUploading, setIsUploading] = useState(false);
  const images = useCachedImages(["upload"]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        await uploadProfileImage(userId, file, token);
        setSelectedImage(file);
        onImageUpload(file);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
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
      <img src={images.upload} alt="Upload image" />
      <h4>Zet uw bestanden hier neer</h4>
      <p>Blader door het bestand vanaf uw computer</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {selectedImage && <p>Bestand: {selectedImage.name}</p>}

      {isUploading && (
        <div className={styles["loading-text"]}>
          <p>Uploaden...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
