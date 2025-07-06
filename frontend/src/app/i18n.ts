import NextI18Next from 'next-i18next';

import path from 'path';

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['ar'],
  localePath: path.resolve('./public/locales'),
  localeStructure: '{{lng}}/{{ns}}',
  localeExtension: 'json',
  detection: {
    order: ['cookie', 'header', 'querystring'],
    caches: ['cookie'],
  },
});

export default NextI18NextInstance;
