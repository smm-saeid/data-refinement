// components/date-picker/MatnaDatePicker.tsx
import { useEffect, useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import gregorian from 'react-date-object/calendars/gregorian';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import { Box, FormHelperText, IconButton } from '@mui/material';
import { Clear, CalendarMonth } from '@mui/icons-material';

type CalendarType = 'persian' | 'gregorian';

interface MatnaDatePickerProps {
  id?: string;
  value?: string | string[] | Date | null;
  onChange: (value: string | string[] | null) => void;
  format?: string;
  outputFormat?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  minDate?: DateObject | Date | string;
  maxDate?: DateObject | Date | string;
  calendarType?: CalendarType;
  range?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

function MatnaDatePicker({
  id,
  value,
  onChange,
  format = 'YYYY/MM/DD',
  outputFormat = 'YYYY-MM-DD',
  error = null,
  disabled = false,
  placeholder = 'تاریخ را انتخاب کنید',
  minDate,
  maxDate,
  calendarType = 'persian',
  range = false,
  multiple = false,
  clearable = true,
  onFocus,
  onBlur,
  ...otherProps
}: MatnaDatePickerProps) {
  const [internalValue, setInternalValue] = useState<
    DateObject | DateObject[] | null
  >(null);
  const [isFocused, setIsFocused] = useState(false);

  const displayCalendar = calendarType === 'persian' ? persian : gregorian;
  const displayLocale = calendarType === 'persian' ? persian_fa : gregorian_en;

  // ✅ تبدیل string (gregorian) به DateObject (persian for display)
  useEffect(() => {
    if (!value) {
      setInternalValue(null);
      return;
    }

    try {
      if (Array.isArray(value)) {
        const dateObjects = value.map(v => {
          // خواندن تاریخ میلادی
          const gregorianDate = new DateObject({
            date: v,
            format: outputFormat,
            calendar: gregorian,
          });
          // تبدیل به جلالی برای نمایش
          return gregorianDate.convert(displayCalendar, displayLocale);
        });
        setInternalValue(dateObjects);
      } else {
        // خواندن تاریخ میلادی
        const gregorianDate = new DateObject({
          date: value,
          format: outputFormat,
          calendar: gregorian,
        });
        // تبدیل به جلالی برای نمایش
        setInternalValue(gregorianDate.convert(displayCalendar, displayLocale));
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      setInternalValue(null);
    }
  }, [value, outputFormat, displayCalendar, displayLocale]);

  // ✅ تبدیل DateObject (persian) به string (gregorian)
  const handleChange = (newValue: DateObject | DateObject[] | null) => {
    setInternalValue(newValue);

    if (!newValue) {
      onChange(null);
      return;
    }

    try {
      if (Array.isArray(newValue)) {
        const stringValues = newValue.map(date => {
          // تبدیل به میلادی
          const gregorianDate = date.convert(gregorian, gregorian_en);
          return gregorianDate.format(outputFormat);
        });
        onChange(stringValues);
      } else {
        // تبدیل به میلادی
        const gregorianDate = newValue.convert(gregorian, gregorian_en);
        onChange(gregorianDate.format(outputFormat));
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      onChange(null);
    }
  };

  const handleClear = () => {
    setInternalValue(null);
    onChange(null);
  };

  const hasValue = () => {
    if (!internalValue) return false;
    if (Array.isArray(internalValue)) return internalValue.length > 0;
    return true;
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',

        '& .rmdp-container': {
          width: '100%',
          display: 'block',
        },

        '& .rmdp-input': {
          width: '100%',
          height: '40px',
          padding: '8.5px 14px',
          paddingLeft: clearable && hasValue() && !disabled ? '80px' : '48px',
          paddingRight: '14px',
          fontSize: '1rem',
          fontFamily: 'inherit',
          fontWeight: 400,
          lineHeight: '1.4375em',
          color: disabled ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.87)',
          backgroundColor: disabled ? 'rgba(0, 0, 0, 0.04)' : '#fff',
          border: `1px solid ${
            error ? '#d32f2f' : isFocused ? '#1976d2' : 'rgba(0, 0, 0, 0.23)'
          }`,
          borderRadius: '4px',
          boxSizing: 'border-box',
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color 0.2s ease, border-width 0.2s ease',

          '&:hover': {
            borderColor: error
              ? '#d32f2f'
              : disabled
                ? 'rgba(0, 0, 0, 0.23)'
                : 'rgba(0, 0, 0, 0.87)',
          },

          '&:focus': {
            outline: 'none',
            borderColor: error ? '#d32f2f' : '#1976d2',
            borderWidth: '2px',
            padding: '7.5px 13px',
            paddingLeft: clearable && hasValue() && !disabled ? '79px' : '47px',
            paddingRight: '13px',
          },

          '&::placeholder': {
            color: 'rgba(0, 0, 0, 0.38)',
            opacity: 1,
          },

          '&:disabled': {
            cursor: 'not-allowed',
            color: 'rgba(0, 0, 0, 0.38)',
          },
        },

        '& .rmdp-wrapper': {
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
          border: 'none',
        },

        '& .rmdp-calendar': {
          fontFamily: 'inherit',
          boxShadow: 'none',
          borderRadius: '8px',
          border: 'none',
          padding: '8px',
        },

        '& .rmdp-header': {
          padding: '8px',
          marginBottom: '8px',
        },

        '& .rmdp-header-values': {
          color: 'rgba(0, 0, 0, 0.87)',
          fontWeight: 500,
        },

        '& .rmdp-day': {
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          color: 'rgba(0, 0, 0, 0.87)',

          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },

        '& .rmdp-day.rmdp-selected': {
          backgroundColor: '#1976d2 !important',
          color: '#fff !important',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.4)',
        },

        '& .rmdp-day.rmdp-today': {
          color: '#1976d2',
          fontWeight: 'bold',
          border: '1px solid #1976d2',
        },

        '& .rmdp-day.rmdp-disabled': {
          color: 'rgba(0, 0, 0, 0.26)',
          cursor: 'not-allowed',
          backgroundColor: 'transparent',
        },

        '& .rmdp-day.rmdp-range': {
          backgroundColor: 'rgba(25, 118, 210, 0.12)',
          color: 'rgba(0, 0, 0, 0.87)',
        },

        '& .rmdp-week-day': {
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: '0.875rem',
          fontWeight: 500,
        },

        '& .rmdp-arrow': {
          border: 'solid #1976d2',
          borderWidth: '0 2px 2px 0',
        },

        '& .rmdp-arrow-container': {
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          transition: 'background-color 0.2s ease',

          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },

        '& .rmdp-month-picker, & .rmdp-year-picker': {
          backgroundColor: '#fff',
        },

        '& .rmdp-ym': {
          borderRadius: '4px',
          transition: 'all 0.2s ease',

          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },

        '& .rmdp-ym.selected': {
          backgroundColor: '#1976d2',
          color: '#fff',
        },
      }}
    >
      <DatePicker
        id={id}
        value={internalValue}
        onChange={handleChange}
        calendar={displayCalendar}
        locale={displayLocale}
        format={format}
        disabled={disabled}
        placeholder={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        range={range}
        multiple={multiple}
        calendarPosition="bottom-right"
        onOpen={() => setIsFocused(true)}
        onClose={() => setIsFocused(false)}
        {...otherProps}
        render={(value, openCalendar) => (
          <Box sx={{ position: 'relative' }}>
            <input
              id={id}
              value={value}
              onClick={openCalendar}
              onFocus={handleFocus}
              onBlur={handleBlur}
              readOnly
              className="rmdp-input"
              placeholder={placeholder}
              disabled={disabled}
            />

            <IconButton
              size="small"
              onClick={openCalendar}
              disabled={disabled}
              tabIndex={-1}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                color: error ? 'error.main' : 'action.active',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <CalendarMonth fontSize="small" />
            </IconButton>

            {clearable && hasValue() && !disabled && (
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  handleClear();
                }}
                tabIndex={-1}
                sx={{
                  position: 'absolute',
                  left: 40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'action.active',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  },
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}
      />
      {error && (<FormHelperText>{error}</FormHelperText>)}
    </Box>
  );
}

export default MatnaDatePicker;
