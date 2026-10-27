// Small validation helpers shared by the write endpoints.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export const asString = (value) => (typeof value === 'string' ? value.trim() : '');

export const isEmail = (value) => EMAIL_RE.test(asString(value));

export const minLength = (value, length) => asString(value).length >= length;
