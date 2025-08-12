import en from './en';
import id from './id';
import zh from './zh';
import { Language } from '@/lib/language';

const translations = {
  en,
  id,
  zh,
};

export function getTranslation(language: Language) {
  return translations[language];
}

export type Translation = typeof en;

type TranslationValue<T = string> = T extends (infer U)[] ? U[] : string;

export function translate<T = string>(key: string, language: Language): TranslationValue<T> {
  const keys = key.split('.');
  let current: any = translations[language];
  
  for (const k of keys) {
    if (current === undefined) return key as TranslationValue<T>;
    current = current[k];
  }
  
  return current || key as TranslationValue<T>;
}
