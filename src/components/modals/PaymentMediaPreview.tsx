import React from "react";
import styles from "../../assets/scss/FundMedia.module.scss";

interface PaymentMediaPreviewProps {
  mediaUrl: string;
  isPdf: boolean;
  onClose: () => void;
}

const PaymentMediaPreview: React.FC<PaymentMediaPreviewProps> = ({
  mediaUrl,
  isPdf,
  onClose,
}) => {
  return (
    <div className={styles["image-preview-overlay"]} onClick={onClose}>
      <div className={styles["preview-container"]}>
        {!isPdf ? (
          <div className={styles["image-preview"]}>
            <img src={mediaUrl} alt="Preview" />
          </div>
        ) : (
          <div className={styles["pdf-preview-container"]}>
            <object
              data={mediaUrl}
              type="application/pdf"
              width="100%"
              height="900px"
            >
              <p>
                "Uw browser ondersteunt geen PDF-weergave. U kunt in plaats
                daarvan het PDF-bestand downloaden."
              </p>
            </object>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMediaPreview;
