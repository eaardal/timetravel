import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import dateLocaleUtil from './dateLocale.util';
import DateTimeUtil from './dateTime.util';
import i18n from 'i18n/i18nCache';

describe('Test dateLocaleUtil', () => {
  beforeEach(() => {
    i18n.initialize();
  });

  it('Should return formated date with formatDay for saturday', () => {
    const date = DateTimeUtil.parse('21.05.2016').toDate();
    const result = dateLocaleUtil.formatDay(deepFreeze(date));

    expect(result).to.equal('Lørdag 21 Mai 2016');
  });
  it('Should return formated date with formatDay for monday', () => {
    const date = DateTimeUtil.parse('23.05.2016').toDate();
    const result = dateLocaleUtil.formatDay(deepFreeze(date));

    expect(result).to.equal('Mandag 23 Mai 2016');
  });
  it('Should return formated date with formatDay for sunday', () => {
    const date = DateTimeUtil.parse('29.05.2016').toDate();
    const result = dateLocaleUtil.formatDay(deepFreeze(date));

    expect(result).to.equal('Søndag 29 Mai 2016');
  });

  it('Should return formated day with formatWeekdayShort', () => {
    const result = dateLocaleUtil.formatWeekdayShort(deepFreeze(0));
    expect(result).to.equal('Man');
  });
  it('Should return formated day with formatWeekdayShort for sunday', () => {
    const result = dateLocaleUtil.formatWeekdayShort(deepFreeze(6));
    expect(result).to.equal('Søn');
  });

  it('Should return formated day with formatWeekdayLong', () => {
    const result = dateLocaleUtil.formatWeekdayLong(deepFreeze(0));
    expect(result).to.equal('Mandag');
  });
  it('Should return formated day with formatWeekdayLong for sunday', () => {
    const result = dateLocaleUtil.formatWeekdayLong(deepFreeze(6));
    expect(result).to.equal('Søndag');
  });

  it('Should an array of months when calling getMonths', () => {
    const result = dateLocaleUtil.getMonths();
    expect(result).to.have.length(12);
    expect(result[0]).to.equal('Januar');
    expect(result[11]).to.equal('Desember');
  });

  it('Should return formated title with formatMonthTitle', () => {
    const date = DateTimeUtil.parse('29.05.2016').toDate();
    const result = dateLocaleUtil.formatMonthTitle(deepFreeze(date));

    expect(result).to.equal('Mai 2016');
  });
});
