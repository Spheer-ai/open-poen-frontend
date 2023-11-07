import React, { useEffect, useState } from "react";
import { initiateGocardless } from "../../middleware/Api";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "../../../assets/scss/layout/Step1BankList.module.scss";

interface Step2BankApprovalProps {
  institutionId: string;
}

const Step2BankApproval: React.FC<Step2BankApprovalProps> = ({
  institutionId,
}) => {
  const { user } = useAuth();
  const token = user?.token;
  const [approvalInfo, setApprovalInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function initiateGocardlessRequest() {
      try {
        if (!token) {
          console.error("Token is missing or expired");
          return;
        }

        const response = await initiateGocardless(
          1,
          institutionId,
          90,
          90,
          token,
        );
        setApprovalInfo(response.url);
      } catch (error) {
        console.error("API Error:", error);
      }
    }

    initiateGocardlessRequest();
  }, [institutionId, token]);

  const handleOpenLink = () => {
    if (approvalInfo) {
      const externalLink = window.open(approvalInfo, "_blank");
      if (externalLink) {
        const checkExternalLink = setInterval(() => {
          if (externalLink.closed) {
            clearInterval(checkExternalLink);
            navigate("/transactions/bankconnections/add-bank?step=3");
          }
        }, 1000);
      }
    }
  };

  return (
    <div>
      {approvalInfo ? (
        <div>
          <p>{`Bank: ${institutionId}`}</p>
          <h3>Geef toestemming</h3>
          <p>
            Ik verklaar dat ik de Privacyverklaring heb gelezen en geef hierbij
            toestemming aan Dyme B.V. om mijn betaalgegevens te ontvangen van
            mijn bank. Ik begripjp dat hier gevoelige informatie bij kan zitten
            en ik ga ermee akkoord dat Dyme ook deze persoonsgegevens ontvangt
            en gebruikt
          </p>
        </div>
      ) : (
        <p>Loading...</p>
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
