import React, { useEffect, useState } from "react";
import { fetchInitiativeMedia } from "../../../middleware/Api";
import styles from "../../../../assets/scss/FundMedia.module.scss";
import LoadingDot from "../../../animation/LoadingDot";

interface MediaItem {
  id: number;
  attachment_thumbnail_url_512: string;
  attachment_url: string;
}

interface FundsMediaProps {
  initiativeId: string;
  authToken: string | null;
}

const FundsMedia: React.FC<FundsMediaProps> = ({ initiativeId, authToken }) => {
  const [mediaData, setMediaData] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetchInitiativeMedia(
          initiativeId,
          undefined,
          undefined,
          authToken,
        );

        const attachments = response?.attachments || [];

        setMediaData(attachments);
      } catch (error) {
        setError("Failed to fetch media. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedia();
  }, [initiativeId, authToken]);

  useEffect(() => {}, [mediaData]);

  const isPdf = (url: string) => url.toLowerCase().includes(".pdf");

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const closePreview = () => {
    setSelectedItem(null);
  };

  const renderMedia = () => {
    return mediaData.map((media, index) => (
      <div
        className={styles["media-item"]}
        key={index}
        onClick={() => handleItemClick(media)}
      >
        {isPdf(media.attachment_url) ? (
          <div className={styles["pdf-preview-container"]}>
            <div className={styles["pdf-preview-rectangle"]}>
              <p>.pdf</p>
            </div>
          </div>
        ) : (
          <img
            src={media.attachment_thumbnail_url_512}
            alt={`Media ${index}`}
          />
        )}
      </div>
    ));
  };

  return (
    <div>
      {isLoading ? (
        <div className={styles["loading-dots"]}>
          <LoadingDot delay={0} />
          <LoadingDot delay={0.1} />
          <LoadingDot delay={0.1} />
          <LoadingDot delay={0.2} />
          <LoadingDot delay={0.2} />
        </div>
      ) : (
        <div className={styles["media-container"]}>
          {mediaData.length === 0 ? (
            <p className={styles["no-media"]}>Geen media gevonden</p>
          ) : (
            renderMedia()
          )}
        </div>
      )}

      {selectedItem && (
        <div className={styles["image-preview-overlay"]} onClick={closePreview}>
          <div className={styles["preview-container"]}>
            {!isPdf(selectedItem.attachment_url) ? (
              <div className={styles["image-preview"]}>
                <img
                  src={selectedItem.attachment_thumbnail_url_512}
                  alt="Preview"
                />
              </div>
            ) : (
              <div className={styles["pdf-preview-container"]}>
                <object
                  data={selectedItem.attachment_url}
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
      )}

      {error && <p className={styles["error-message"]}>{error}</p>}
    </div>
  );
};

export default FundsMedia;
