export const getId = (item) => item?._id || item?.id;

export const unwrap = (response) => response?.data?.data;

export const unwrapList = (response) => {
  const data = unwrap(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export const formatDate = (value, options = {}) => {
  if (!value) return 'TBA';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'TBA';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: options.withYear === false ? undefined : 'numeric',
    hour: options.time ? '2-digit' : undefined,
    minute: options.time ? '2-digit' : undefined,
  }).format(date);
};

export const teamName = (team) => team?.shortName || team?.name || 'TBA';

export const playerName = (player) =>
  player?.fullName || [player?.firstName, player?.lastName].filter(Boolean).join(' ') || 'Unknown player';

export const statusLabel = (status) => String(status || 'UNKNOWN').replaceAll('_', ' ');

export const apiErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || error?.message || fallback;
