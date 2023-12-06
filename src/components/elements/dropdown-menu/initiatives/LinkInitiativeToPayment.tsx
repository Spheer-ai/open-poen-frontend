// LinkInitiativeToPayment.tsx
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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDropdownOpen) {
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
    }
  }, [token, paymentId, isDropdownOpen]);

  const handleLinkInitiativeClick = () => {
    setIsDropdownOpen(true);
  };

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
          <span
            onClick={handleLinkInitiativeClick}
            style={{ cursor: "pointer" }}
          >
            {linkableInitiatives.length > 0
              ? isDropdownOpen
                ? "Close Dropdown"
                : "Link Initiative"
              : "No Initiatives Available"}
          </span>
          {isDropdownOpen && (
            <div>
              <select
                value={selectedInitiative}
                onChange={(e) => setSelectedInitiative(Number(e.target.value))}
              >
                <option value="">Select an initiative</option>
                {linkableInitiatives.map((initiative) => (
                  <option key={initiative.id} value={initiative.id}>
                    {initiative.name}
                  </option>
                ))}
              </select>
              <button onClick={handleLinkInitiative}>Link Initiative</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkInitiativeToPayment;
