let currentLocale = "nl";

export const setLocale = (locale) => {
  currentLocale = locale;
};

export const getLocale = () => {
  return currentLocale;
};
