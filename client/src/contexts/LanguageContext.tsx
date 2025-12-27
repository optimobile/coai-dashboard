import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr" | "de" | "es" | "it" | "nl" | "pl" | "pt" | "ru" | "zh" | "ja" | "ko" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: "ltr" | "rtl";
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as Language | null;
    const browserLanguage = navigator.language.split("-")[0].toLowerCase() as Language;
    
    const supportedLanguages: Language[] = ["en", "fr", "de", "es", "it", "nl", "pl", "pt", "ru", "zh", "ja", "ko", "ar"];
    
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else if (supportedLanguages.includes(browserLanguage)) {
      setLanguageState(browserLanguage);
    }
    
    setIsLoading(false);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred-language", lang);
    
    // Update document direction for RTL languages
    const htmlElement = document.documentElement;
    if (lang === "ar") {
      htmlElement.dir = "rtl";
      htmlElement.lang = lang;
    } else {
      htmlElement.dir = "ltr";
      htmlElement.lang = lang;
    }
  };

  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, direction, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
