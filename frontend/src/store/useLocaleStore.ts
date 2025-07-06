import create from 'zustand';

interface LocaleState {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  isRTL: boolean;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang, isRTL: lang === 'ar' }),
  isRTL: false,
}));
