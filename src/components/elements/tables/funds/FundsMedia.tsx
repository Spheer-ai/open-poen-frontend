import React, { useEffect, useState } from "react";
import { fetchInitiativeMedia } from "../../../middleware/Api";
import styles from "../../../../assets/scss/FundMedia.module.scss";
import LoadingDot from "../../../animation/LoadingDot";

interface MediaItem {
  attachment_thumbnail_url_512: string;
  attachment_url: string;
}

interface FundsMediaProps {
  initiativeId: string;
}

const FundsMedia: React.FC<FundsMediaProps> = ({ initiativeId }) => {
  const [mediaData, setMediaData] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetchInitiativeMedia(initiativeId);
        setMediaData(response.attachments);
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedia();
  }, [initiativeId]);

  const isPdf = (url: string) => /\.pdf/i.test(url);

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);

    if (isPdf(item.attachment_url)) {
      console.log("Clicked item is recognized as a PDF:", item);
    }
  };

  const closePreview = () => {
    setSelectedItem(null);
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
            mediaData.map((media, index) => (
              <div
                className={styles["media-item"]}
                key={index}
                onClick={() => handleItemClick(media)}
              >
                {isPdf(media.attachment_url) ? (
                  <a href={media.attachment_url} download>
                    PDF
                  </a>
                ) : (
                  <img
                    src={media.attachment_thumbnail_url_512}
                    alt={`Media ${index}`}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
      {selectedItem && (
        <div className={styles["image-preview-overlay"]} onClick={closePreview}>
          <div className={styles["image-preview"]}>
            {!isPdf(selectedItem.attachment_url) ? (
              <img
                src={selectedItem.attachment_thumbnail_url_512}
                alt="Preview"
              />
            ) : (
              <div>
                <a href={selectedItem.attachment_url} download>
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FundsMedia;
