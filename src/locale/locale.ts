let currentLocale = "nl"; // Set the initial locale

export const setLocale = (locale) => {
  currentLocale = locale;
};

export const getLocale = () => {
  return currentLocale;
};