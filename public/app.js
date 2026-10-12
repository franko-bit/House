// public/app.js — HOMELINE frontend API client

const API_BASE = '';  // same-origin (Express serves this file)

// ────────────────────────────────────────────────────────
// AUTH HELPERS
// ────────────────────────────────────────────────────────
const Auth = {
  getToken() {
    return localStorage.getItem('token');
  },
  getAgent() {
    try { return JSON.parse(localStorage.getItem('agent') || 'null'); }
    catch { return null; }
  },
  isLoggedIn() {
    return Boolean(this.getToken());
  },
  isAdmin() {
    const agent = this.getAgent();
    return agent && agent.role === 'admin';
  },
  login(token, agent) {
    localStorage.setItem('token', token);
    localStorage.setItem('agent', JSON.stringify(agent));
    document.body.classList.add('logged-in');
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('agent');
    document.body.classList.remove('logged-in');
    window.location.href = 'login.html';
  },
  headers() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

// ────────────────────────────────────────────────────────
// API HELPERS
// ────────────────────────────────────────────────────────
const API = {
  async get(path) {
    // FIX: send the auth header on GET requests too
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { ...Auth.headers() },
    });

    // Expired / invalid token: clear it and send the user to log in
    if (res.status === 401 && Auth.isLoggedIn()) {
      Auth.logout();
      throw new Error('Session expired. Please log in again.');
    }

    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `GET ${path} failed`);
    return res.json();
  },

  async post(path, body, isFormData = false) {
    const headers = { ...Auth.headers() };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `POST ${path} failed`);
    return data;
  },

  async put(path, body, isFormData = false) {
    const headers = { ...Auth.headers() };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `PUT ${path} failed`);
    return data;
  },

  async del(path) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: Auth.headers(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `DELETE ${path} failed`);
    return data;
  },

  // Public
  listProperties(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/api/properties${qs ? '?' + qs : ''}`);
  },
  getProperty(id) {
    return this.get(`/api/properties/${encodeURIComponent(id)}`);
  },
  createInquiry(payload) {
    return this.post('/api/inquiries', payload);
  },
  login(email, password) {
    return this.post('/api/auth/login', { email, password });
  },

  // Admin
  createProperty(formData) {
    return this.post('/api/properties', formData, true);
  },
  updateProperty(id, formData) {
    return this.put(`/api/properties/${id}`, formData, true);
  },
  deleteProperty(id) {
    return this.del(`/api/properties/${id}`);
  },
  getDashboardStats() {
    return this.get('/api/dashboard/stats');
  },
  getRecentProperties() {
    return this.get('/api/dashboard/recent-properties');
  },
  listInquiries() {
    return this.get('/api/inquiries');
  },
};

// ────────────────────────────────────────────────────────
// FORMAT HELPERS
// ────────────────────────────────────────────────────────
function formatPrice(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' Fr';
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ────────────────────────────────────────────────────────
// NAV / AUTH UI (shared across pages)
// ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Sync body class with auth state
  if (Auth.isLoggedIn()) {
    document.body.classList.add('logged-in');
  }

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Logout
  document.querySelectorAll('[data-action="logout"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  });
});

// Expose globally
window.API = API;
window.Auth = Auth;
window.formatPrice = formatPrice;
window.escapeHtml = escapeHtml;
window.getQueryParam = getQueryParam;