// messages.js
import { createIntl } from "react-intl";

// Create an empty object to store messages globally
const messages = {};

// Function to load messages dynamically based on the active locale
export const loadMessages = async (locale: string) => {
  try {
    const messagesModule = await import(`../lang/${locale}/messages.json`);
    messages[locale] = messagesModule.default;
    console.log(`Loaded messages for locale "${locale}":`, messages[locale]);
  } catch (error) {
    console.error("Error loading messages:", error);
  }
};

// Function to create an Intl instance with loaded messages
export const createIntlWithMessages = (locale: string) => {
  return createIntl({ locale, messages: messages[locale] || {} });
};
