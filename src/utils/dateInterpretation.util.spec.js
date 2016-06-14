/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */

import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import {
  interpretTextAsDate,
} from './dateInterpretation.util';
import DateTimeUtil from './dateTime.util';
import i18n from 'i18n/i18nCache';

const createDateTimeUtilStub = () => {
  const stub = {
    now: sinon.stub(DateTimeUtil, 'now'),
  };
  stub.restore = () => {
    stub.now.restore();
  };
  return stub;
};

describe('Test dateInterpretationUtil', () => {
  const mockNow = moment('2016-05-24');
  let dateTimeUtilStub;

  beforeEach(() => {
    i18n.initialize();
    dateTimeUtilStub = createDateTimeUtilStub();
    dateTimeUtilStub.now.returns(mockNow);
  });

  afterEach(() => {
    dateTimeUtilStub.restore();
  });

  context('interpretTextAsDate', () => {
    it('Should exist - ice breaker', () => {
      expect(interpretTextAsDate).to.exist;
    });

    it('Should return wrong input value "16 02" as is', () => {
      const text = '16 02';
      const expectedResult = '16 02';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong input value "1 2" as is', () => {
      const text = '1 2';
      const expectedResult = '1 2';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong input value "2/2" as is', () => {
      const text = '2/2';
      const expectedResult = '2/2';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong input value "2,2" as is', () => {
      const text = '2,2';
      const expectedResult = '2,2';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong input value "122" as is', () => {
      const text = '122';
      const expectedResult = '122';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong input value "12222" as is', () => {
      const text = '12222';
      const expectedResult = '12222';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret value "17." 17.06.2016', () => {
      const text = '17.';
      const expectedResult = '17.06.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong input value "171." as is', () => {
      const text = '171.';
      const expectedResult = '171.';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "15122016" as 15.12.2016', () => {
      const text = '15122016';
      const expectedResult = '15.12.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "151216" as 15.12.2016', () => {
      const text = '151216';
      const expectedResult = '15.12.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret 27 (number) as 27.05.2016', () => {
      const input = 27;
      const expectedResult = '27.05.2016';
      const date = interpretTextAsDate(input);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret 2 (number) as 02.06.2016', () => {
      const input = 2;
      const expectedResult = '02.06.2016';
      const date = interpretTextAsDate(input);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret 2.2 (number) as 02.02.2017', () => {
      const input = 2.2;
      const expectedResult = '02.02.2017';
      const date = interpretTextAsDate(input);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret 2.02 (number) as 02.02.2017', () => {
      const input = 2.02;
      const expectedResult = '02.02.2017';
      const date = interpretTextAsDate(input);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret 1 as 01.06.2016 ', () => {
      const text = '1';
      const expectedDate = '01.06.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedDate);
    });

    it('Should interpret 1. as 01.06.2016 ', () => {
      const text = '1.';
      const expectedDate = '01.06.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedDate);
    });

    it('Should return wrong value "." as is ', () => {
      const text = '.';
      const expectedResult = '.';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong value " " as is ', () => {
      const text = ' ';
      const expectedResult = ' ';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should return wrong value ".3" as is', () => {
      const text = '.3';
      const expectedResult = '.3';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "010217" as 01.02.2017', () => {
      const text = '010217';
      const expectedResult = '01.02.2017';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "010617" as 01.06.2017', () => {
      const text = '010617';
      const expectedResult = '01.06.2017';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "01022017" as 01.02.2017', () => {
      const text = '01022017';
      const expectedResult = '01.02.2017';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "01062017" as 01.06.2017', () => {
      const text = '01062017';
      const expectedResult = '01.06.2017';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "11.10." as 11.10.2016', () => {
      const text = '11.10.';
      const expectedResult = '11.10.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "5.10." as 05.10.2016', () => {
      const text = '5.10.';
      const expectedResult = '05.10.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    it('Should interpret "1.06.2016" as 01.06.2016', () => {
      const text = '1.06.2016';
      const expectedResult = '01.06.2016';
      const date = interpretTextAsDate(text);
      expect(date).to.equal(expectedResult);
    });

    context('when month is has less dates than number entered', () => {
      beforeEach(() => {
        const date = moment('2016-02-15');
        dateTimeUtilStub.now.returns(date);
      });

      it('Should interpret "31" as 31.03.2016 when today is 15.02.2016', () => {
        const text = '31';
        const expectedResult = '31.03.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });
    });

    context('when month is december and entered date adjusts to next month (january next year)', () => {
      beforeEach(() => {
        const date = moment('2016-12-15');
        dateTimeUtilStub.now.returns(date);
      });

      it('Should interpret "14" as 14.01.2017', () => {
        const text = '14';
        const expectedResult = '14.01.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should interpret "14.12" as 14.12.2017', () => {
        const text = '14.12';
        const expectedResult = '14.12.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });
    });

    context('#93844: autoformatting edited date', () => {
      it('Should format "1006.2016" to 10.06.2016', () => {
        const text = '1006.2016';
        const expectedResult = '10.06.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "0303.2017" to 03.03.2017', () => {
        const text = '0303.2017';
        const expectedResult = '03.03.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "2805.2017" to 28.05.2017', () => {
        const text = '2805.2017';
        const expectedResult = '28.05.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "10.062016" to 10.06.2016', () => {
        const text = '10.062016';
        const expectedResult = '10.06.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "10.0616" to 10.06.2016', () => {
        const text = '10.0616';
        const expectedResult = '10.06.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "1006.16" to 10.06.2016', () => {
        const text = '1006.16';
        const expectedResult = '10.06.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "1005.16" to 10.05.2016', () => {
        const text = '1005.16';
        const expectedResult = '10.05.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "0404.16" to 04.04.2016', () => {
        const text = '0404.16';
        const expectedResult = '04.04.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "2405.16" to 24.05.2016', () => {
        const text = '2405.16';
        const expectedResult = '24.05.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "1005.2016" to 10.05.2016', () => {
        const text = '1005.2016';
        const expectedResult = '10.05.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "0404.2016" to 04.04.2016', () => {
        const text = '0404.2016';
        const expectedResult = '04.04.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "2405.2016" to 24.05.2016', () => {
        const text = '2405.2016';
        const expectedResult = '24.05.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "2605.2018" to 26.05.2018', () => {
        const text = '2605.2018';
        const expectedResult = '26.05.2018';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "1008.19" to 10.08.2019', () => {
        const text = '1008.19';
        const expectedResult = '10.08.2019';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "26.052018" to 26.05.2018', () => {
        const text = '26.052018';
        const expectedResult = '26.05.2018';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "10.0819" to 10.08.2019', () => {
        const text = '10.0819';
        const expectedResult = '10.08.2019';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "3.3.16" as 03.03.2016', () => {
        const text = '3.3.16';
        const expectedResult = '03.03.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "9.3." as 09.03.2017', () => {
        const text = '9.3.';
        const expectedResult = '09.03.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "9.6." as 09.03.2016', () => {
        const text = '9.6.';
        const expectedResult = '09.06.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "3.4.18" as 03.04.2018', () => {
        const text = '3.4.18';
        const expectedResult = '03.04.2018';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });

      it('Should format "3.4.2018" as 03.04.2018', () => {
        const text = '3.4.2018';
        const expectedResult = '03.04.2018';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedResult);
      });
    });

    context('#93723 task tests: date formats', () => {
      it('Should accept D', () => {
        const d = '2';
        const expectedResult = '02.06.2016';
        const date = interpretTextAsDate(d);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept DD', () => {
        const dd = '22';
        const expectedResult = '22.06.2016';
        const date = interpretTextAsDate(dd);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept DD.MM', () => {
        const ddmm = '12.12';
        const expectedResult = '12.12.2016';
        const date = interpretTextAsDate(ddmm);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept D.M', () => {
        const dm = '2.5';
        const expectedResult = '02.05.2017';
        const date = interpretTextAsDate(dm);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept DDMM', () => {
        const ddmm = '1412';
        const expectedResult = '14.12.2016';
        const date = interpretTextAsDate(ddmm);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept DD.MM.YY', () => {
        const ddmmyy = '14.10.16';
        const expectedResult = '14.10.2016';
        const date = interpretTextAsDate(ddmmyy);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept D.M.YY', () => {
        const dmyy = '1.9.16';
        const expectedResult = '01.09.2016';
        const date = interpretTextAsDate(dmyy);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept DDMMYY', () => {
        const ddmmyy = '141016';
        const expectedResult = '14.10.2016';
        const date = interpretTextAsDate(ddmmyy);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept DD.MM.YYYY', () => {
        const ddmmyy = '14.10.2016';
        const expectedResult = '14.10.2016';
        const date = interpretTextAsDate(ddmmyy);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept D.M.YYYY', () => {
        const dmyy = '1.1.2017';
        const expectedResult = '01.01.2017';
        const date = interpretTextAsDate(dmyy);
        expect(date).to.equal(expectedResult);
      });

      it('Should accept DDMMYYYY', () => {
        const ddmmyyyy = '22112016';
        const expectedResult = '22.11.2016';
        const date = interpretTextAsDate(ddmmyyyy);
        expect(date).to.equal(expectedResult);
      });
    });

    context('#93721 user story spec tests: current date is 16.01.2016', () => {
      beforeEach(() => {
        const dateUsedInUserStory = moment('2016-01-16 00:00Z');
        dateTimeUtilStub.now.returns(dateUsedInUserStory);
      });

      it('Should interpret 11 as 11.02.2016 ', () => {
        const text = '11';
        const expectedDate = '11.02.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedDate);
      });

      it('Should interpret 26 as 26.01.2016', () => {
        const text = '26';
        const expectedDate = '26.01.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedDate);
      });

      it('Should interpret 11.03 as 11.03.2016', () => {
        const text = '11.03';
        const expectedDate = '11.03.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedDate);
      });

      it('Should interpret 11.3 as 11.03.2016', () => {
        const text = '11.3';
        const expectedDate = '11.03.2016';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedDate);
      });

      it('Should interpret 11.01 as 11.01.2017', () => {
        const text = '11.01';
        const expectedDate = '11.01.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedDate);
      });

      it('Should interpret 11.1 as 11.01.2017', () => {
        const text = '11.1';
        const expectedDate = '11.01.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedDate);
      });

      it('Should interpret 1.1 as 01.01.2017', () => {
        const text = '1.1';
        const expectedDate = '01.01.2017';
        const date = interpretTextAsDate(text);
        expect(date).to.equal(expectedDate);
      });
    });
  });
});
