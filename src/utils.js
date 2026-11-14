export const CATEGORIES = ['Academic', 'Career', 'Cultural', 'Sports', 'Workshop', 'Social', 'Other'];

export const fmtDate = (iso) =>
  new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

export const fmtDay = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

// API returns timestamps without a timezone suffix; datetime-local wants "YYYY-MM-DDTHH:mm"
export const toInputValue = (iso) => (iso ? iso.slice(0, 16) : '');
