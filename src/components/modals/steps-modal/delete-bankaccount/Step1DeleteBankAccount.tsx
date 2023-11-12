import React, { useState } from "react";
import { deleteBankAccount } from "../../../middleware/Api";
import styles from "../../../../assets/scss/layout/Step1BankList.module.scss";

interface Step1DeleteBankAccountProps {
  userId: string | null;
  token: string | null;
  bankAccountId: number | null;
  onDelete: () => void;
}

const Step1DeleteBankAccount: React.FC<Step1DeleteBankAccountProps> = ({
  userId,
  token,
  bankAccountId,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteBankAccount = async () => {
    if (userId && token && bankAccountId) {
      setIsLoading(true);

      try {
        await deleteBankAccount(userId, token, bankAccountId);
        console.log("Bank account deleted successfully");
        setIsLoading(false);
        onDelete();
      } catch (error) {
        console.error("Error deleting bank account:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <p>
        Er staat een verwijdering van de bankkoppeling op het punt uitgevoerd te
        worden. Belangrijk: deze actie resulteert in de definitieve verwijdering
        van alle transacties die via deze bankrekening zijn verwerkt uit het
        systeem. Deze handeling is onomkeerbaar.
      </p>
      <div className={styles["button-container"]}>
        <button
          className={styles.deleteButton}
          onClick={handleDeleteBankAccount}
          disabled={isLoading}
        >
          {isLoading ? "Bezig met verijderen..." : "Bank account verwijderen"}
        </button>
      </div>
    </div>
  );
};

export default Step1DeleteBankAccount;
