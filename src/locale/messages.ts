// messages.js
const messages = {
  en: {
    // English messages
    "auth.genericError": "An error occurred during login.",
    "auth.usernamePasswordRequired": "Username and password are required.",
    "auth.emptyEmail": "Please enter an email address to continue.",
    "auth.badCredentials": "Invalid username or password. Please try again.",
    "auth.emailValidation":
      "Invalid email address. Please enter a valid email.",
    // Add more messages as needed
  },
  nl: {
    // Dutch messages
    "auth.genericError": "Er is een fout opgetreden tijdens het inloggen.",
    "auth.emailValidation": "Foutief e-mailadres.",
    "auth.usernamePasswordRequired":
      "Gebruikersnaam en wachtwoord zijn verplicht.",
    "auth.emptyEmail": "Vul een e-mailadres in om verder te gaan.",
    "auth.badCredentials":
      "Ongeldige gebruikersnaam of wachtwoord. Probeer het opnieuw.",
    // Add more messages as needed
  },
};

const defaultLocale = "nl";

export { messages, defaultLocale };
