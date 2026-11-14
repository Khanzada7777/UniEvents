const BASE = import.meta.env.VITE_API_URL || '/api';

export const getToken = () => localStorage.getItem('token');

async function request(path, { method = 'GET', body, blob = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const data = await res.json();
      message = data.message || data.title || message;
    } catch {
      if (res.status === 401) message = 'Please log in to continue.';
      if (res.status === 403) message = 'You do not have permission to do that.';
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  if (blob) return res.blob();
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const qs = (params = {}) => {
  const s = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  ).toString();
  return s ? `?${s}` : '';
};

export const api = {
  // auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  signup: (data) => request('/auth/register', { method: 'POST', body: data }),

  // events
  events: (params) => request(`/events${qs(params)}`),
  event: (id) => request(`/events/${id}`),
  createEvent: (data) => request('/events', { method: 'POST', body: data }),
  updateEvent: (id, data) => request(`/events/${id}`, { method: 'PUT', body: data }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  participants: (id) => request(`/events/${id}/participants`),
  exportParticipants: (id) => request(`/events/${id}/participants/export`, { blob: true }),

  // registrations
  register: (eventId) => request(`/events/${eventId}/register`, { method: 'POST' }),
  cancel: (eventId) => request(`/events/${eventId}/register`, { method: 'DELETE' }),
  myRegistrations: () => request('/registrations/my'),
};
