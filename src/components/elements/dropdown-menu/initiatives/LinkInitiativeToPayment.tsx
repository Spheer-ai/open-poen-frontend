import React, { useState, useEffect } from "react";
import {
  fetchLinkableInitiatives,
  linkInitiativeToPayment,
} from "../../../middleware/Api";

interface Initiative {
  id: number;
  name: string;
}

interface LinkInitiativeToPaymentProps {
  token: string;
  paymentId: number;
}

const LinkInitiativeToPayment: React.FC<LinkInitiativeToPaymentProps> = ({
  token,
  paymentId,
}) => {
  const [linkableInitiatives, setLinkableInitiatives] = useState<Initiative[]>(
    [],
  );
  const [selectedInitiative, setSelectedInitiative] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLinkableInitiativesForPayment = async () => {
      try {
        setIsLoading(true);
        const initiatives: Initiative[] = await fetchLinkableInitiatives(
          token,
          paymentId,
        );
        console.log("Initiatives:", initiatives);
        setLinkableInitiatives(initiatives);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching linkable initiatives:", error);
        setIsLoading(false);
      }
    };

    getLinkableInitiativesForPayment();
  }, [token, paymentId]);

  useEffect(() => {
    if (selectedInitiative !== "") {
      handleLinkInitiative();
    }
  }, [selectedInitiative]);

  const handleLinkInitiative = async () => {
    try {
      setIsLoading(true);
      await linkInitiativeToPayment(token, paymentId, selectedInitiative);
      setIsLoading(false);
    } catch (error) {
      console.error("Error linking initiative to payment:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <select
            value={selectedInitiative}
            onChange={(e) => setSelectedInitiative(Number(e.target.value))}
          >
            <option value="">Verbind initatief</option>
            {linkableInitiatives.map((initiative) => (
              <option key={initiative.id} value={initiative.id}>
                {initiative.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LinkInitiativeToPayment;
