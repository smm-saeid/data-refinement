type QueryParams = Record<string, string | number | boolean | null | undefined>;

const paramsSerializer = (params?: QueryParams) => {
  if (!params) {
    return '';
  }

  const entries = Object.entries(params).filter(
    ([key, value]) =>
      key !== 'count' && value !== null && value !== undefined && value !== ''
  );

  if (entries.length === 0) {
    return '';
  }

  const serialized = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `?${serialized}`;
};

export default paramsSerializer;

