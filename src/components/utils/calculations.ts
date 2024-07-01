// utils/calculations.js

export const calculateBarWidth = (budget, expenses) => {
  const available = Math.max(budget + expenses, 0);
  const spent = Math.abs(expenses);
  const total = available + spent;
  if (total === 0) {
    return {
      availableWidth: "50%",
      spentWidth: "50%",
    };
  }
  const availableWidth = `${(available / total) * 100}%`;
  const spentWidth = `${(spent / total) * 100}%`;
  return {
    availableWidth,
    spentWidth,
  };
};

export const formatCurrency = (amount) => {
  return amount.toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
