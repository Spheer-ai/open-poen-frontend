import React, { useEffect, useState } from "react";
import styles from "../../assets/scss/layout/AddFundDesktop.module.scss";
import LoadingDot from "../animation/LoadingDot";
import Select from "react-select";
import LinkInitiativePaymentToActivity from "../elements/dropdown-menu/activities/LinkInitiativePaymentToActivity";
import {
  cancelPayment,
  deletePaymentAttachment,
  editPayment,
  fetchPaymentAttachments,
  uploadPaymentAttachment,
} from "../middleware/Api";
import PaymentMediaPreview from "./PaymentMediaPreview";
import { useFieldPermissions } from "../../contexts/FieldPermissionContext";
import useCachedImages from "../utils/images";

interface Attachment {
  attachment_id: number;
  id: number;
  name: string;
  url: string;
  attachment_thumbnail_url_128: string;
  attachment_url: string;
}

export interface Transaction {
  id: number;
  booking_date: string;
  activity_name: string;
  creditor_name: string;
  debtor_name: string;
  n_attachments: number;
  transaction_amount: number;
  transaction_id: number;
  creditor_account: string;
  debtor_account: string;
  route: string;
  short_user_description: string;
  long_user_description: string;
  hidden: boolean;
}

interface EditPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  isBlockingInteraction: boolean;
  onPaymentEdited: () => void;
  paymentId: number | null;
  paymentData: Transaction | null;
  token: string | null;
  fieldPermissions;
  fields: string[];
  hasDeletePermission;
  initiativeId?: string | null;
  activityName: string | null;
}

const EditPayment: React.FC<EditPaymentProps> = ({
  isOpen,
  onClose,
  isBlockingInteraction,
  onPaymentEdited,
  paymentId,
  paymentData,
  token,
  hasDeletePermission,
  initiativeId,
  activityName,
  fields,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);
  const [displayDate, setDisplayDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shortDescError, setShortDescError] = useState("");
  const [longDescError, setLongDescError] = useState("");
  const [apiDate, setApiDate] = useState("");
  const { fieldPermissions, fetchFieldPermissions } = useFieldPermissions();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<Set<number>>(
    new Set(),
  );
  const images = useCachedImages(["close", "closePreview", "upload"]);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [isPdfPreview, setIsPdfPreview] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [transactionData, setTransactionData] = useState({
    transaction_amount: paymentData?.transaction_amount?.toString() || "",
    booking_date: paymentData?.booking_date || "",
    creditor_name: paymentData?.creditor_name || "",
    debtor_name: paymentData?.debtor_name || "",
    creditor_account: paymentData?.creditor_account || "",
    debtor_account: paymentData?.debtor_account || "",
    route: paymentData?.route || "inkomen",
    short_user_description: paymentData?.short_user_description || "",
    long_user_description: paymentData?.long_user_description || "",
    hidden: paymentData?.hidden || false,
    activity_name: paymentData?.activity_name || "",
  });
  const routeOptions = [
    { value: "inkomen", label: "Inkomen" },
    { value: "uitgaven", label: "Uitgaven" },
  ];

  const handleOpenMediaPreview = (url: string, isPdf: boolean) => {
    setSelectedMediaUrl(url);
    setIsPdfPreview(isPdf);
  };

  const handleCloseMediaPreview = () => {
    setSelectedMediaUrl(null);
    setIsPdfPreview(false);
  };

  const fetchAttachments = async () => {
    try {
      if (paymentId && token) {
        const fetchedAttachments = await fetchPaymentAttachments(
          paymentId,
          token,
        );
        setAttachments(fetchedAttachments);
      }
    } catch (error) {
      console.error("Error fetching payment attachments:", error);
    }
  };

  useEffect(() => {
    if (isOpen && paymentData) {
      fetchAttachments();
    }
  }, [isOpen, paymentData, token, paymentId]);

  useEffect(() => {}, [paymentData]);

  useEffect(() => {
    if (isOpen) {
      setModalIsOpen(true);
    } else {
      setTimeout(() => {
        setModalIsOpen(false);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentData) {
      setTransactionData({
        transaction_amount: paymentData.transaction_amount.toString(),
        booking_date: paymentData.booking_date,
        creditor_name: paymentData.creditor_name,
        debtor_name: paymentData.debtor_name,
        creditor_account: paymentData.creditor_account,
        debtor_account: paymentData.debtor_account,
        route: paymentData.route || "inkomen",
        short_user_description: paymentData.short_user_description,
        long_user_description: paymentData.long_user_description,
        activity_name: paymentData.activity_name || "",
        hidden: paymentData.hidden || false,
      });

      setDisplayDate(formatDateForInput(new Date(paymentData.booking_date)));
      setApiDate(paymentData.booking_date);
    }
  }, [paymentData]);

  useEffect(() => {
    if (isOpen && paymentId !== null && token) {
      fetchFieldPermissions("Payment", paymentId, token);
    }
  }, [isOpen, paymentId, token, fetchFieldPermissions]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;

    setDisplayDate(newDate);

    setTransactionData({
      ...transactionData,
      booking_date: newDate,
    });
  };

  const handleResetState = () => {
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (transactionData.short_user_description.length > 128) {
      setShortDescError(
        "Korte beschrijving mag niet meer dan 128 tekens bevatten.",
      );
      return;
    }

    if (transactionData.long_user_description.length > 512) {
      setLongDescError(
        "Lange beschrijving mag niet meer dan 512 tekens bevatten.",
      );
      return;
    }

    try {
      setIsLoading(true);
      if (!token) {
        console.error("Token is not available.");
        return;
      }

      const displayDateObject = new Date(displayDate);

      if (isNaN(displayDateObject.getTime())) {
        console.error("Invalid date format");
        return;
      }

      for (const attachmentId of deletedAttachmentIds) {
        await deletePaymentAttachment(paymentId, attachmentId, token);
      }

      const apiDate = displayDateObject.toISOString();

      const originalPaymentData = paymentData || {};

      const formattedAmount = transactionData.transaction_amount.replace(
        ",",
        ".",
      );
      if (!isValidAmount(formattedAmount)) {
        setErrorMessage("Ongeldige invoer. Vul een correct bedrag in");
        setIsLoading(false);
        return;
      }

      let requestData = {
        transaction_id: paymentId,
        booking_date: apiDate,
        creditor_name: transactionData.creditor_name,
        debtor_name: transactionData.debtor_name,
        creditor_account: transactionData.creditor_account,
        debtor_account: transactionData.debtor_account,
        route: transactionData.route,
        short_user_description: transactionData.short_user_description,
        long_user_description: transactionData.long_user_description,
        hidden: transactionData.hidden,
        transaction_amount: parseFloat(formattedAmount),
      };

      for (const key in requestData) {
        if (
          requestData[key] === originalPaymentData[key] ||
          requestData[key] === ""
        ) {
          delete requestData[key];
        }
      }

      for (const file of selectedFiles) {
        await uploadPaymentAttachment(paymentId, file, token);
      }

      await editPayment(paymentId, requestData, token);

      onPaymentEdited();
      handleResetState();
      resetState();
      setIsLoading(false);
      handleClose();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorMessage = "Ongeldige invoer. Vul een correct bedrag in";
        setErrorMessage(errorMessage);
      } else {
        console.error("Error editing payment:", error);
      }
    }
  };

  const resetState = () => {
    setTransactionData({
      transaction_amount: "",
      booking_date: "",
      creditor_name: "",
      debtor_name: "",
      creditor_account: "",
      debtor_account: "",
      route: "inkomen",
      short_user_description: "",
      long_user_description: "",
      hidden: false,
      activity_name: "",
    });
    setDisplayDate("");
    setApiDate("");
    setIsLoading(false);
    setSelectedFile(null);
    setSelectedFiles([]);
    setDeletedAttachmentIds(new Set());
    setErrorMessage("");
    setShortDescError("");
    setLongDescError("");
  };

  const handleClose = () => {
    if (!isBlockingInteraction) {
      resetState();
      setModalIsOpen(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (!token) {
        console.error("Token is not available.");
        return;
      }

      if (!paymentId) {
        console.error("Payment ID is not available.");
        return;
      }
      await cancelPayment(paymentId, token);
      onPaymentEdited();
      setIsLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files.length > 0) {
      setSelectedFiles([...selectedFiles, ...fileInput.files]);
    }
  };

  const handleCancelImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleDeleteImage = (attachmentId: number) => {
    setDeletedAttachmentIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(attachmentId)) {
        newIds.delete(attachmentId);
      } else {
        newIds.add(attachmentId);
      }
      return newIds;
    });
  };

  const isPDF = (attachment: Attachment) => {
    return attachment.attachment_url.toLowerCase().includes(".pdf");
  };

  const isImage = (attachment: Attachment) => {
    return attachment.attachment_url;
  };

  function parseNumberOrReturnNull(value) {
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? null : parsedValue;
  }

  function isValidAmount(value) {
    const numberRegex = /^-?\d*\.?\d+$/;
    return numberRegex.test(value);
  }

  return (
    <>
      <div
        className={`${styles.backdrop} ${modalIsOpen ? styles.open : ""}`}
        onClick={handleClose}
      ></div>

      <div className={`${styles.modal} ${modalIsOpen ? styles.open : ""}`}>
        <div className={styles.formTop}>
          <h2 className={styles.title}>Transacties bewerken</h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <img src={images.close} alt="Close Icon" />
          </button>
        </div>
        <hr></hr>
        {isLoading && (
          <div className={styles["loading-container"]}>
            <LoadingDot delay={0} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.1} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.2} />
          </div>
        )}
        {!isLoading ? (
          <>
            <div className={`${styles.formGroup}`}>
              <label className={styles.labelField}>Media:</label>
              <div className={styles.containerPreview}>
                {attachments.map(
                  (attachment, index) =>
                    !deletedAttachmentIds.has(attachment.id) && (
                      <div className={styles.imagePreview} key={attachment.id}>
                        <div className={styles.imageContainer}>
                          <div className={styles.pdfContainer}>
                            {isPDF(attachment) ? (
                              <div
                                className={styles.pdfPreview}
                                onClick={() =>
                                  handleOpenMediaPreview(
                                    attachment.attachment_url,
                                    true,
                                  )
                                }
                              >
                                <span>.pdf</span>
                              </div>
                            ) : isImage(attachment) ? (
                              <img
                                src={attachment.attachment_thumbnail_url_128}
                                alt={`Image Preview ${index + 1}`}
                                className={styles.previewImage}
                                style={{ borderRadius: "8px" }}
                                onClick={() =>
                                  handleOpenMediaPreview(
                                    attachment.attachment_url,
                                    false,
                                  )
                                }
                              />
                            ) : (
                              <div>Onbekend bestand</div>
                            )}
                            <button
                              className={styles.closeButton}
                              onClick={() => handleDeleteImage(attachment.id)}
                            >
                              <img src={images.closePreview} alt="Close Icon" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                )}
                {selectedFiles.map((file, index) => (
                  <div className={styles.imagePreview} key={index}>
                    <div className={styles.imageContainer}>
                      <div className={styles.pdfContainer}>
                        {file.type === "application/pdf" ? (
                          <div
                            className={styles.pdfPreview}
                            onClick={() =>
                              handleOpenMediaPreview(
                                URL.createObjectURL(file),
                                true,
                              )
                            }
                          >
                            <span>.pdf</span>
                          </div>
                        ) : (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Image Preview ${index + 1}`}
                            className={styles.previewImage}
                            style={{ borderRadius: "8px" }}
                            onClick={() =>
                              handleOpenMediaPreview(
                                URL.createObjectURL(file),
                                false,
                              )
                            }
                          />
                        )}
                        <button
                          className={styles.closeButton}
                          onClick={() => handleCancelImage(index)}
                        >
                          <img src={images.closePreview} alt="Close Icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <>
                <label htmlFor="fileInput" className={styles.customFileInput}>
                  <div>
                    {" "}
                    <img src={images.upload} alt="Upload Image" />
                  </div>
                  <span>
                    Sleep en zet neer of blader om bestanden te uploaden
                  </span>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".pdf, .jpg, .png"
                    multiple
                    onChange={handleFileChange}
                    className={styles.hiddenFileInput}
                  />
                </label>
              </>
            </div>
            <div className={styles.formGroup}>
              <h3>Info</h3>
              <label className={styles.labelField}>Bedrag:</label>
              <input
                type="text"
                value={transactionData.transaction_amount}
                onChange={(e) => {
                  const userInput = e.target.value;
                  const formattedValue = userInput.replace(",", ".");
                  setTransactionData({
                    ...transactionData,
                    transaction_amount: formattedValue,
                  });
                  setErrorMessage("");
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "-" &&
                    !transactionData.transaction_amount.includes("-")
                  ) {
                    setTransactionData({
                      ...transactionData,
                      route: "uitgaven",
                    });
                  } else if (
                    !transactionData.transaction_amount.startsWith("-")
                  ) {
                    setTransactionData({
                      ...transactionData,
                      route: "inkomen",
                    });
                  }
                }}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("transaction_amount")
                  )
                }
              />
              {errorMessage && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
                  {errorMessage}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Activiteit:</label>
              <LinkInitiativePaymentToActivity
                token={token !== null ? token : undefined}
                paymentId={parseNumberOrReturnNull(paymentId)}
                initiativeId={parseNumberOrReturnNull(initiativeId)}
                activityName={activityName}
                isInitiativeLinked={true}
                linkedActivityId={null}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Datum:</label>
              <input
                type="date"
                value={displayDate}
                onChange={handleDateChange}
                onKeyDown={handleEnterKeyPress}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("booking_date")
                  )
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Naam betaler:</label>
              <input
                type="text"
                value={transactionData.debtor_name}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    debtor_name: e.target.value,
                  })
                }
                onKeyDown={handleEnterKeyPress}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("debtor_name")
                  )
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Betaal IBAN</label>
              <input
                type="text"
                value={transactionData.debtor_account}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    debtor_account: e.target.value,
                  })
                }
                onKeyDown={handleEnterKeyPress}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("debtor_account")
                  )
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Naam ontvanger:</label>
              <input
                type="text"
                value={transactionData.creditor_name}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    creditor_name: e.target.value,
                  })
                }
                onKeyDown={handleEnterKeyPress}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("creditor_name")
                  )
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Ontvanger IBAN</label>
              <input
                type="text"
                value={transactionData.creditor_account}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    creditor_account: e.target.value,
                  })
                }
                onKeyDown={handleEnterKeyPress}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("creditor_account")
                  )
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Route:</label>
              <div style={{ marginTop: "10px" }}>
                <Select
                  options={routeOptions}
                  value={routeOptions.find(
                    (option) => option.value === transactionData.route,
                  )}
                  onChange={(selectedOption) =>
                    setTransactionData({
                      ...transactionData,
                      route: selectedOption?.value || "",
                    })
                  }
                  isDisabled={
                    !(
                      fieldPermissions &&
                      fieldPermissions.fields &&
                      fieldPermissions.fields.includes("route")
                    )
                  }
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Korte beschrijving</label>
              <input
                type="text"
                value={transactionData.short_user_description}
                onChange={(e) => {
                  setTransactionData({
                    ...transactionData,
                    short_user_description: e.target.value,
                  });
                  if (e.target.value.length > 128) {
                    setShortDescError(
                      "Korte beschrijving mag niet meer dan 128 tekens bevatten.",
                    );
                  } else {
                    setShortDescError("");
                  }
                }}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("short_user_description")
                  )
                }
              />
              {shortDescError && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
                  {shortDescError}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.labelField}>Lange beschrijving</label>
              <input
                type="text"
                value={transactionData.long_user_description}
                onChange={(e) => {
                  setTransactionData({
                    ...transactionData,
                    long_user_description: e.target.value,
                  });
                  if (e.target.value.length > 512) {
                    setLongDescError(
                      "Lange beschrijving mag niet meer dan 512 tekens bevatten.",
                    );
                  } else {
                    setLongDescError("");
                  }
                }}
                disabled={
                  !(
                    fieldPermissions &&
                    fieldPermissions.fields &&
                    fieldPermissions.fields.includes("long_user_description")
                  )
                }
              />
              {longDescError && (
                <span
                  style={{ color: "red", display: "block", marginTop: "5px" }}
                >
                  {longDescError}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <div className={styles.roleOptions}>
                <label className={styles.labelField}>
                  <input
                    type="checkbox"
                    checked={transactionData.hidden}
                    onChange={(e) =>
                      setTransactionData({
                        ...transactionData,
                        hidden: e.target.checked,
                      })
                    }
                    disabled={
                      !(
                        fieldPermissions &&
                        fieldPermissions.fields &&
                        fieldPermissions.fields.includes("hidden")
                      )
                    }
                  />
                  Transactie verbergen
                </label>
              </div>
            </div>
          </>
        ) : null}
        <div className={styles.buttonContainer}>
          {hasDeletePermission && (
            <button onClick={handleDelete} className={styles.deleteButton}>
              Verwijderen
            </button>
          )}
          <button onClick={handleClose} className={styles.cancelButton}>
            Annuleren
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Opslaan
          </button>
        </div>
      </div>
      {selectedMediaUrl && (
        <PaymentMediaPreview
          mediaUrl={selectedMediaUrl}
          isPdf={isPdfPreview}
          onClose={handleCloseMediaPreview}
        />
      )}
    </>
  );
};

export default EditPayment;
