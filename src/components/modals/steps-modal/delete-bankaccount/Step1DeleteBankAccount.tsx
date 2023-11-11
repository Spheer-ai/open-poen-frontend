import React, { useState } from "react";
import { deleteBankAccount } from "../../../middleware/Api";

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
      <h2>Delete Bank Account</h2>
      <p>
        Are you sure you want to delete this bank account? This action cannot be
        undone.
      </p>
      <button onClick={handleDeleteBankAccount} disabled={isLoading}>
        {isLoading ? "Deleting..." : "Delete Bank Account"}
      </button>
    </div>
  );
};

export default Step1DeleteBankAccount;
