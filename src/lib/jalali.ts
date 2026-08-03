import moment from 'moment-jalaali';

moment.loadPersian({
  usePersianDigits: true,
  dialect: 'persian-modern',
});

const jalali = {
  // Pure functions - no React dependency
  format: (date: Date | string | null, format = 'jYYYY/jMM/jDD'): string => {
    if (!date) return '';
    return moment(date).format(format);
  },

  parse: (jalaliDate: string, format = 'jYYYY/jMM/jDD'): Date => {
    return moment(jalaliDate, format).toDate();
  },

  isValid: (jalaliDate: string, format = 'jYYYY/jMM/jDD'): boolean => {
    return moment(jalaliDate, format, true).isValid();
  },

  now: (): string => moment().format('jYYYY/jMM/jDD'),

  fromNow: (date: Date | string): string => moment(date).fromNow(),

  timestampToJalali: (timestamp: number, format = 'jYYYY/jMM/jDD', timestampUnit = 's') => {
    if (!timestamp) return '';
    switch (timestampUnit) {
      case 's':
        timestamp = timestamp * 1000;
    }
    const date = new Date(timestamp);
    return jalali.format(date, format);
  },
};

export default jalali;