import { language, conf } from './custom-languages/neon';

class MonacoCustomLanguage {

  definition: monaco.languages.ILanguageExtensionPoint;

  constructor(id: string) {
    this.definition = {
      id: id
    };
  }

  async apply (monaco) {
    monaco.languages.register(this.definition);
    monaco.languages.setMonarchTokensProvider(this.definition.id, language);
    monaco.languages.setLanguageConfiguration(this.definition.id, conf);
    return monaco;
  }
}

export default new MonacoCustomLanguage('neon');
