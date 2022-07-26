function translationsFactory(translations: { [locale: string]: { [key: string]: string } }) {
  return {
    'en-US': {
      ...translations['en-US'],
    },
    'fr-FR': {
      ...translations['fr-FR'],
    },
  };
}

export { translationsFactory };
