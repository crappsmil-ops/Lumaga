import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext({ lang: "de", setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("truthsip_lang") || "de");

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem("truthsip_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}