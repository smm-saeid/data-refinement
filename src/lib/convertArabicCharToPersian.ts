type ConvertibleInput = string | number | Array<string | number>;

export const convertArabicCharToPersian = (text: ConvertibleInput) => {
  if (typeof text !== 'string') {
    return text;
  }

  let result = text;
  const lookup: Record<string, string> = {
    ك: 'ک',
    دِ: 'د',
    بِ: 'ب',
    زِ: 'ز',
    ذِ: 'ذ',
    شِ: 'ش',
    سِ: 'س',
    ى: 'ی',
    ي: 'ی',
    '١': '۱',
    '٢': '۲',
    '٣': '۳',
    '٤': '۴',
    '٥': '۵',
    '٦': '۶',
    '٧': '۷',
    '٨': '۸',
    '٩': '۹',
    '٠': '۰',
  };

  Object.entries(lookup).forEach(([key, value]) => {
    result = result.replaceAll(key, value);
  });

  return result;
};

export const convertEnglishCharToPersian = (text: ConvertibleInput) => {
  if (typeof text !== 'string') {
    return String(text);
  }

  let result = text;
  const lookup: Record<string, string> = {
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
    '0': '۰',
  };

  Object.entries(lookup).forEach(([key, value]) => {
    result = result.replaceAll(key, value);
  });

  return result;
};

