// Thin API client. The dev server proxies /api to the backend service, so the
// browser always talks to a single origin.

const BASE = '/api';

async function request(path, { method = 'GET', body, signal } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    signal,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.error || 'Something went wrong. Please try again.');
    error.status = response.status;
    error.fields = payload?.fields || null;
    throw error;
  }

  return payload;
}

const toQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : '';
};

export const getProperties = (params) => request(`/properties${toQuery(params)}`);

export const getFacets = () => request('/properties/facets');

export const getProperty = (slug) => request(`/properties/${encodeURIComponent(slug)}`);

export const getSimilarProperties = (slug, limit = 3) =>
  request(`/properties/${encodeURIComponent(slug)}/similar${toQuery({ limit })}`);

export const getAgents = () => request('/agents');

export const sendInquiry = (payload) => request('/inquiries', { method: 'POST', body: payload });

export const subscribeNewsletter = (email) =>
  request('/newsletter', { method: 'POST', body: { email } });
