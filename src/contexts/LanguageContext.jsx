import { createContext, useContext, useState, useEffect } from 'react';
export const LanguageContext = createContext();

const getInitialLanguage = () => {
    // 先檢查 localStorage
    const savedLang = localStorage.getItem('portfolio-language');
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
        return savedLang;
    }
    
    // 沒有儲存的語言偏好，根據瀏覽器語言判斷
    const browserLang = navigator.language || navigator.languages[0];
    return browserLang.startsWith('zh') ? 'zh' : 'en';
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(getInitialLanguage);
    const [key, setKey] = useState(0);
    
    const toggleLang = () => {
        setLang((prev) => {
            const newLang = prev === 'en' ? 'zh' : 'en';
            localStorage.setItem('portfolio-language', newLang);
            return newLang;
        });
        setKey(prev => prev + 1); // 強制重新渲染
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, key }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext); 