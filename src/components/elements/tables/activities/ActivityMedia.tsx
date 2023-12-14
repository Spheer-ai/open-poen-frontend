import React, { useEffect, useState } from "react";
import { fetchActivityMedia } from "../../../middleware/Api";
import styles from "../../../../assets/scss/FundMedia.module.scss";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface MediaItem {
  attachment_thumbnail_url_512: string;
  attachment_url: string;
}

interface ActivityMediaProps {
  initiativeId: string;
  activityId: string;
}

const ActivityMedia: React.FC<ActivityMediaProps> = ({
  initiativeId,
  activityId,
}) => {
  const [mediaData, setMediaData] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetchActivityMedia(initiativeId, activityId);
        setMediaData(response.attachments);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    }

    fetchMedia();
  }, [initiativeId, activityId]);

  const isPdf = (url: string) => url.toLowerCase().includes(".pdf");

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const closePreview = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <div className={styles["media-container"]}>
        {mediaData.map((media, index) => (
          <div
            className={styles["media-item"]}
            key={index}
            onClick={() => handleItemClick(media)}
          >
            {isPdf(media.attachment_url) ? (
              <div className={styles["pdf-preview"]}>
                <Document file={encodeURIComponent(media.attachment_url)}>
                  <Page pageNumber={1} />
                </Document>
              </div>
            ) : (
              <img
                src={media.attachment_thumbnail_url_512}
                alt={`Media ${index}`}
              />
            )}
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className={styles["image-preview-overlay"]} onClick={closePreview}>
          <div className={styles["image-preview"]}>
            {isPdf(selectedItem.attachment_url) ? (
              <div className={styles["pdf-preview"]}>
                <Document file={selectedItem.attachment_url}>
                  <Page pageNumber={1} />
                </Document>
              </div>
            ) : (
              <img
                src={selectedItem.attachment_thumbnail_url_512}
                alt="Preview"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityMedia;
