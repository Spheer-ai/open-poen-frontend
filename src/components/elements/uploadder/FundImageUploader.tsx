import React, { useState, useRef } from "react";
import styles from "../../../assets/scss/ImageUploader.module.scss";
import { uploadFundPicture } from "../../../components/middleware/Api";

interface ImageUploaderProps {
  initiativeId: string;
  token: string;
  onImageSelected: (file: File) => void;
}

const FundImageUploader: React.FC<ImageUploaderProps> = ({
  initiativeId,
  token,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        await uploadFundPicture(initiativeId, file, token);
        setSelectedImage(file);
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

      {selectedImage && <p>Bestand: {selectedImage.name}</p>}

      {isUploading && (
        <div className={styles["loading-text"]}>
          <p>Uploaden...</p>
        </div>
      )}
    </div>
  );
};

export default FundImageUploader;
