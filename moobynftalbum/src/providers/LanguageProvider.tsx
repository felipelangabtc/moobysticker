import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language, translations } from '@/i18n/translations';
import { STORAGE_KEYS } from '@/config/constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  isPortuguese: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem(STORAGE_KEYS.language) as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'pt') {
        setLanguageState('pt');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.language, lang);
  };

  const t = translations[language];
  const isPortuguese = language === 'pt';

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isPortuguese,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
