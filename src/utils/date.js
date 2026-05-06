export function formatDateTime(value) {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function getScheduleState(item) {
  const now = Date.now();
  const start = new Date(item?.startTime).getTime();
  const end = new Date(item?.endTime).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return 'scheduled';
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
}

export function toLocalInputValue(date) {
  const value = date instanceof Date ? date : new Date(date);
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}
