import isEmpty from 'lodash/isEmpty';
import IntlMessageFormat from 'intl-messageformat';
import i18nCommon from 'i18n/common.i18n';
import i18nDate from 'components/DatePicker/datePicker.i18n';
import i18nError from 'i18n/errorCodes.i18n';
import i18nTransfer from 'features/overfoere/overfoere.i18n';
import i18nTransferValidation from 'features/overfoere/overfoere.validation.i18n';

class I18nCache {
  constructor() {
    this.formatOptions = {
      number: {
        twoDecimals: { minimumFractionDigits: 2 },
        noDecimals: { maximumFractionDigits: 0 },
      },
      date: {
        mediumNoYear: {
          day: 'numeric',
          month: 'short',
        },
        full: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        },
        full_no_year: {
          day: 'numeric',
          month: 'long',
        },
        standard: {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      },
    };
    this.templates = Object.assign(
      {},
      i18nCommon,
      i18nDate,
      i18nTransfer,
      i18nTransferValidation,
      i18nError
    );
    this.templateRegistry = {};
    this.locale = this.getLocale();
  }

  static get instance() {
    if (!this._instancae) {
      this._instance = new I18nCache();
    }
    return this._instance;
  }

  translate(selectTemplateFunc, obj) {
    if (isEmpty(this.templateRegistry)) {
      throw new Error('Attempting to translate before I18nService.initialize() has been called.');
    } else {
      const cachedTranslation = selectTemplateFunc(this.templateRegistry);
      if (!cachedTranslation) {
        throw new Error(
          'No cached translation found for the given expression', selectTemplateFunc, obj);
      }
      return cachedTranslation.format(obj);
    }
  }

  initialize() {
    for (const template in this.templates) {
      if (this.templates.hasOwnProperty(template)) {
        const localeTemplate = this.templates[template][this.locale];
        this.templateRegistry[template] = this.createCachedTranslation(localeTemplate);
      }
    }
  }

  createCachedTranslation(localeTemplate) {
    const intlMessageFormat =
      new IntlMessageFormat(localeTemplate, this.locale, this.formatOptions);

    return {
      locale: this.locale,
      localeTemplate,
      intlMessageFormat,
      format: (obj) => intlMessageFormat.format(obj),
    };
  }

  getLocale() {
    return 'nb-NO';
  }
}

export default I18nCache.instance;
