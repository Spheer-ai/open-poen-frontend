let currentLocale = "en";

export const setLocale = (locale) => {
  currentLocale = locale;
};

export const getLocale = () => {
  return currentLocale;
};
