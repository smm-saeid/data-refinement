export const MILLISECONDS_IN_MINUTE = 60000;
export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;

export const TIME_OPTIONS = {
  tokenExpiration: [5, 10, 20, 30, 45, 60],
  passwordExpiration: [1, 2, 3, 4, 8, 13, 26, 52],
  maxLoginAttempt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  lockUserDuration: {
    minutes: [5, 15, 30, 45],
    hours: [1, 2, 3, 6, 8, 12, 24, 36, 48],
  },
  minPasswordLength: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  preventPreviousPassword: [1, 2, 3, 4, 5],
};
