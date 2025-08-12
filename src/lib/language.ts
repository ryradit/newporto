export type Language = 'en' | 'id' | 'zh';

export const DEFAULT_LANGUAGE: Language = 'en';

export function getLanguageFromCode(code: string): Language {
  switch (code.toLowerCase()) {
    case 'id':
      return 'id';
    case 'zh':
      return 'zh';
    default:
      return 'en';
  }
}

export function getLanguageLabel(language: Language): string {
  switch (language) {
    case 'id':
      return 'ID';
    case 'zh':
      return '简体中文';
    default:
      return 'EN';
  }
}
