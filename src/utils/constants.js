export const SALARY_TYPES={
    FIXED:'fixed',
    PER_SESSION:'per_session'
};
export const SALARY_TYPE_LABELS = {
  [SALARY_TYPES.FIXED]: 'راتب ثابت',
  [SALARY_TYPES.PER_SESSION]: 'راتب بالجلسة'
};
export const COLORS = {
  PRIMARY_DARK: 'rgb(35, 31, 32)',
  PRIMARY_ORANGE: 'rgb(227, 106, 37)',
  PRIMARY_DARKEST: 'rgb(36, 30, 32)',
  PRIMARY_GRAY: 'rgb(33, 31, 32)',
  PRIMARY_CHARCOAL: 'rgb(34, 30, 31)',
  PRIMARY_WHITE: 'rgb(255, 255, 255)',
  SECONDARY_ORANGE: 'rgb(212, 129, 37)',
  ACCENT_PURPLE: 'rgb(35, 30, 34)',
  ACCENT_MEDIUM: 'rgb(36, 32, 33)',
  ACCENT_BROWN: 'rgb(35, 31, 30)'
};
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};
export const FORM_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_LENGTH: 11,
  MAX_SALARY_FIXED: 100000,
  MAX_SALARY_PER_SESSION: 5000,
  MIN_SALARY: 1
};