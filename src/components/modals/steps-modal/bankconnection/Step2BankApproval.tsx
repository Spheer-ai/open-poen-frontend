import React, { useEffect, useState } from "react";
import { initiateGocardless } from "../../../middleware/Api";
import { useAuth } from "../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../../../../assets/scss/layout/Step1BankList.module.scss";
import useCachedImages from "../../../utils/images";

interface Step2BankApprovalProps {
  institutionId: string;
}

const Step2BankApproval: React.FC<Step2BankApprovalProps> = ({
  institutionId,
}) => {
  const { user } = useAuth();
  const userId = user?.userId ? user.userId.toString() : null;
  const token = user?.token;
  const [approvalInfo, setApprovalInfo] = useState<string | null>(null);
  const navigate = useNavigate();
  const images = useCachedImages(["connector"]);

  useEffect(() => {
    async function initiateGocardlessRequest() {
      try {
        if (!token) {
          console.error("Token is missing or expired");
          return;
        }

        if (userId !== null) {
          const response = await initiateGocardless(
            userId,
            institutionId,
            90,
            90,
            token,
          );
          setApprovalInfo(response.url);
        } else {
          console.error("Invalid or missing userId");
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    }

    initiateGocardlessRequest();
  }, [userId, institutionId, token]);

  const handleOpenLink = () => {
    if (approvalInfo) {
      const externalLink = window.open(approvalInfo);
      if (externalLink) {
        const checkExternalLink = setInterval(() => {
          if (externalLink.closed) {
            clearInterval(checkExternalLink);
            navigate(
              "/transactions/bankconnections/add-bank?step=3&message=${message}",
            );
          }
        }, 1000);
      }
    }
  };

  return (
    <div className={styles["step-container"]}>
      <div className={styles["bankinfo-container"]}>
        <img
          className={styles["logo"]}
          src="/open-poen-logo-blue.svg"
          alt="Home Logo"
        />
        <img className={styles["connector"]} src={images.connector} alt="" />
        <img
          className={styles["logo"]}
          src="/open-poen-logo-blue.svg"
          alt="Home Logo"
        />
      </div>
      {approvalInfo ? (
        <div>
          <h3>Geef toestemming</h3>
          <p>
            Ik verklaar dat ik de Privacyverklaring heb gelezen en geef hierbij
            toestemming aan Open Poen om mijn betaalgegevens te ontvangen van
            mijn bank. Ik begrijp dat hier gevoelige informatie bij kan zitten
            en ik ga ermee akkoord dat Open Poen ook deze persoonsgegevens
            ontvangt en gebruikt
          </p>
        </div>
      ) : (
        <p>Laden...</p>
      )}
      <div className={styles["button-container"]}>
        <button className={styles.saveButton} onClick={handleOpenLink}>
          Accepteer en ga door
        </button>
      </div>
    </div>
  );
};

export default Step2BankApproval;
