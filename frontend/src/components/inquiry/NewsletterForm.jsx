import { useState } from 'react';

import { subscribeNewsletter } from '../../lib/api.js';
import Icon from '../ui/Icon.jsx';

/** Footer newsletter signup — stores the address via the API. */
export default function NewsletterForm({ tone = 'light' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setMessage('Thank you — market reports will arrive in your inbox.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Please enter a valid email address.');
    }
  };

  const dark = tone === 'dark';

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <label
        htmlFor="newsletter-email"
        className={dark ? 'mb-3 block font-display text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/60' : 'field-label'}
      >
        Market report
      </label>

      <div
        className={
          dark
            ? 'flex items-center gap-2 rounded-ui border border-white/20 bg-white/[0.06] px-4 py-2 focus-within:border-champagne'
            : 'flex items-center gap-2 rounded-ui border border-navy/15 bg-white px-4 py-2 focus-within:border-navy'
        }
      >
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== 'idle') setStatus('idle');
          }}
          placeholder="you@example.com"
          aria-invalid={status === 'error'}
          aria-describedby="newsletter-message"
          className={
            dark
              ? 'min-h-[40px] w-full bg-transparent text-[0.92rem] text-white placeholder:text-white/40 focus:outline-none'
              : 'min-h-[40px] w-full bg-transparent text-[0.92rem] text-ink placeholder:text-ink-faint focus:outline-none'
          }
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-label="Subscribe to the market report"
          className={
            dark
              ? 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-ui bg-champagne text-navy transition-colors duration-300 ease-premium hover:bg-champagne-soft disabled:opacity-60'
              : 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-ui bg-navy text-white transition-colors duration-300 ease-premium hover:bg-navy-700 disabled:opacity-60'
          }
        >
          <Icon name={status === 'success' ? 'check' : 'arrowRight'} size={18} />
        </button>
      </div>

      <p
        id="newsletter-message"
        role="status"
        className={
          dark
            ? `mt-3 min-h-[1.25rem] text-[0.8rem] ${status === 'error' ? 'text-champagne-soft' : 'text-white/60'}`
            : `mt-3 min-h-[1.25rem] text-[0.8rem] ${status === 'error' ? 'text-red-600' : 'text-ink-soft'}`
        }
      >
        {message}
      </p>
    </form>
  );
}
