import React, { useEffect, useState } from "react";
import { fetchInstitutions } from "../../../middleware/Api";
import styles from "../../../../assets/scss/layout/Step1BankList.module.scss";

interface Bank {
  id: string;
  name: string;
  logo: string;
}

interface Step1BankListProps {
  onNextStep: () => void;
  onSelectBank: (institutionId: string) => void;
}

const Step1BankList: React.FC<Step1BankListProps> = ({
  onNextStep,
  onSelectBank,
}) => {
  const [bankList, setBankList] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBankData() {
      try {
        const data = await fetchInstitutions();
        setBankList(data.institutions);
      } catch (error) {}
    }

    fetchBankData();
  }, []);

  const handleSelectBank = (institutionId: string) => {
    setSelectedBank(institutionId);
    onSelectBank(institutionId);
  };

  const handleNextStep = () => {
    if (selectedBank) {
      onNextStep();
    }
  };

  return (
    <div>
      <ul className={styles["bank-list"]}>
        {bankList.map((bank) => (
          <li
            key={bank.id}
            className={`${styles["bank-item"]} ${
              selectedBank === bank.id ? styles.selected : ""
            }`}
            onClick={() => handleSelectBank(bank.id)}
          >
            <div className={styles["bank-item-content"]}>
              <img src={bank.logo} alt={bank.name} />
              <span className={styles["bank-name"]}>{bank.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Step1BankList;
