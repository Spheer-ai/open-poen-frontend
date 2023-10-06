const messages = {
  en: {
    // English messages
    "auth.genericError": "An error occurred during login.",
    "auth.usernamePasswordRequired": "Username and password are required.",
    "auth.emptyEmail": "Please enter an email address to continue.",
    "auth.badCredentials": "Invalid username or password. Please try again.",
    "auth.emailValidation":
      "Invalid email address. Please enter a valid email.",
    "addUser.SelectRole": "Choose a role to proceed.",
    "addUser.AlreadyExist": "User is already known.",
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
    "addUser.SelectRole": "Kies een rol om verder te gaan.",
    "addUser.AlreadyExist": "Gebruiker is reeds bekend.",
  },
  fy: {
    // Frieze messages
    "auth.genericError": "Der is in flater optrêden by it ynladen.",
    "auth.usernamePasswordRequired":
      "Brûkersnamme en wachtwurd binne ferplichte.",
    "auth.emptyEmail": "Fier in emailadres yn om fierder te gean.",
    "auth.badCredentials":
      "ûngeldige brûkersnamme of wachtwurd. Besykje it nochris.",
    "auth.emailValidation": "Fout emailadres. Fier in jildich emailadres yn.",
    "addUser.SelectRole": "Kies in rol om fierder te gean.",
    "addUser.AlreadyExist": "Brûker is al bekend.",
  },
};

const defaultLocale = "nl";

export { messages, defaultLocale };
