import React, { useEffect, useState } from "react";
import { initiateGocardless } from "../../middleware/Api";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
          7,
          7,
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
            // Redirect to the route with the step parameter
            navigate(
              "/transactions/bankconnections/add-bank/gocardless-success?step=3",
            );
          }
        }, 1000);
      }
    }
  };

  return (
    <div>
      <h2>Step 2: Bank Approval</h2>
      {approvalInfo ? (
        <div>
          <p>{`Bank: ${institutionId}`}</p>
          <p>{`Random Info Request for Approval: ${approvalInfo}`}</p>
          <button onClick={handleOpenLink}>Open Link</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Step2BankApproval;
