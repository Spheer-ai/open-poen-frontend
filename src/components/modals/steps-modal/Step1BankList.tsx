import React, { useEffect, useState } from "react";
import { fetchInstitutions } from "../../middleware/Api";
import styles from "../../../assets/scss/layout/Step1BankList.module.scss";

interface Bank {
  id: string;
  name: string;
  logo: string;
}

interface Step1BankListProps {
  onNextStep: () => void;
}

const Step1BankList: React.FC<Step1BankListProps> = ({ onNextStep }) => {
  const [bankList, setBankList] = useState<Bank[]>([]);

  useEffect(() => {
    async function fetchBankData() {
      try {
        const data = await fetchInstitutions();
        setBankList(data.institutions);
      } catch (error) {}
    }

    fetchBankData();
  }, []);

  return (
    <div>
      <h2>Step 1: Fetching List of Bank Accounts</h2>
      <ul>
        {bankList.map((bank) => (
          <li key={bank.id} className={styles["bank-item"]}>
            <img src={bank.logo} alt={bank.name} />
            <span className={styles["bank-name"]}>{bank.name}</span>
          </li>
        ))}
      </ul>
      <button onClick={onNextStep}>Next</button>
    </div>
  );
};

export default Step1BankList;
