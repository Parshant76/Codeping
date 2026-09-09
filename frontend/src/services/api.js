const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('codeping_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  health: () => request('/health'),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getContests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/contests${query ? `?${query}` : ''}`);
  },
  getPlatforms: () => request('/contests/platforms'),
  syncContests: () => request('/contests/sync', { method: 'POST' }),
  getReminders: () => request('/reminders'),
  createReminder: (body) => request('/reminders', { method: 'POST', body: JSON.stringify(body) }),
  deleteReminder: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),
  updatePreferences: (body) =>
    request('/reminders/preferences', { method: 'PATCH', body: JSON.stringify(body) }),
};
