import { useState } from 'react';

import { sendInquiry } from '../../lib/api.js';
import { classNames, todayISO } from '../../lib/format.js';
import { VIEWING_TIMES } from '../../lib/content.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

/**
 * One enquiry form for every capture point: property enquiry, viewing request
 * and the general contact page. Validates locally, then posts to the API.
 */
export default function InquiryForm({
  kind = 'contact',
  propertySlug = null,
  propertyName = null,
  agentName = null,
  submitLabel,
  compact = false,
  onDone = null,
  idPrefix = 'inquiry',
}) {
  const isViewing = kind === 'viewing';

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredDate: '',
    preferredTime: VIEWING_TIMES[0],
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [formError, setFormError] = useState('');

  const update = (field) => (event) => {
    const { value } = event.target;
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => (previous[field] ? { ...previous, [field]: undefined } : previous));
  };

  const validate = () => {
    const next = {};
    if (values.name.trim().length < 2) next.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(values.email.trim())) {
      next.email = 'Please enter a valid email address';
    }
    if (isViewing && !values.preferredDate) next.preferredDate = 'Choose a preferred date';
    if (!isViewing && values.message.trim().length < 10) {
      next.message = 'Please add a short message (10 characters or more)';
    }
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    setFormError('');

    if (Object.keys(validation).length > 0) return;

    setStatus('submitting');

    try {
      await sendInquiry({
        kind,
        propertySlug,
        propertyName,
        agentName,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        preferredDate: isViewing ? values.preferredDate : null,
        preferredTime: isViewing ? values.preferredTime : null,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      if (error.fields) setErrors(error.fields);
      setFormError(error.message || 'We could not send your message. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        className={classNames(
          'rounded-ui border border-champagne/40 bg-champagne/10 p-6 text-center',
          compact ? '' : 'lg:p-8',
        )}
      >
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy text-champagne">
          <Icon name="check" size={22} />
        </span>
        <h3 className="mt-4 font-display text-[1.15rem] font-bold text-navy">
          {isViewing ? 'Your viewing request is with us' : 'Thank you — your message is on its way'}
        </h3>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
          {isViewing
            ? `We will confirm ${values.preferredDate} at ${values.preferredTime} by email shortly.`
            : 'One of our advisors will reply within one business day.'}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setValues({
                name: '',
                email: '',
                phone: '',
                message: '',
                preferredDate: '',
                preferredTime: VIEWING_TIMES[0],
              });
              setStatus('idle');
            }}
          >
            Send another
          </Button>
          {onDone ? (
            <Button variant="primary" size="sm" onClick={onDone}>
              Done
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const fieldId = (field) => `${idPrefix}-${field}`;
  const errorClass = 'mt-1.5 text-[0.78rem] text-red-600';

  return (
    <form onSubmit={onSubmit} noValidate className={classNames('grid gap-4', compact ? '' : 'sm:grid-cols-2')}>
      <div className={compact ? '' : 'sm:col-span-2'}>
        <label className="field-label" htmlFor={fieldId('name')}>
          Full name
        </label>
        <input
          id={fieldId('name')}
          name="name"
          autoComplete="name"
          className="field"
          value={values.name}
          onChange={update('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? fieldId('name-error') : undefined}
        />
        {errors.name ? (
          <p id={fieldId('name-error')} className={errorClass}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label className="field-label" htmlFor={fieldId('email')}>
          Email
        </label>
        <input
          id={fieldId('email')}
          name="email"
          type="email"
          autoComplete="email"
          className="field"
          value={values.email}
          onChange={update('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? fieldId('email-error') : undefined}
        />
        {errors.email ? (
          <p id={fieldId('email-error')} className={errorClass}>
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label className="field-label" htmlFor={fieldId('phone')}>
          Phone <span className="font-normal normal-case tracking-normal text-ink-faint">(optional)</span>
        </label>
        <input
          id={fieldId('phone')}
          name="phone"
          type="tel"
          autoComplete="tel"
          className="field"
          value={values.phone}
          onChange={update('phone')}
        />
      </div>

      {isViewing ? (
        <>
          <div>
            <label className="field-label" htmlFor={fieldId('preferredDate')}>
              Preferred date
            </label>
            <input
              id={fieldId('preferredDate')}
              name="preferredDate"
              type="date"
              min={todayISO()}
              className="field"
              value={values.preferredDate}
              onChange={update('preferredDate')}
              aria-invalid={Boolean(errors.preferredDate)}
              aria-describedby={errors.preferredDate ? fieldId('date-error') : undefined}
            />
            {errors.preferredDate ? (
              <p id={fieldId('date-error')} className={errorClass}>
                {errors.preferredDate}
              </p>
            ) : null}
          </div>

          <div>
            <label className="field-label" htmlFor={fieldId('preferredTime')}>
              Preferred time
            </label>
            <select
              id={fieldId('preferredTime')}
              name="preferredTime"
              className="select-field"
              value={values.preferredTime}
              onChange={update('preferredTime')}
            >
              {VIEWING_TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}

      <div className={compact ? '' : 'sm:col-span-2'}>
        <label className="field-label" htmlFor={fieldId('message')}>
          {isViewing ? (
            <>
              Notes <span className="font-normal normal-case tracking-normal text-ink-faint">(optional)</span>
            </>
          ) : (
            'Message'
          )}
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={isViewing ? 3 : 5}
          className="field resize-y"
          value={values.message}
          onChange={update('message')}
          placeholder={
            propertyName
              ? `I would like to know more about ${propertyName}.`
              : 'Tell us what you are looking for.'
          }
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? fieldId('message-error') : undefined}
        />
        {errors.message ? (
          <p id={fieldId('message-error')} className={errorClass}>
            {errors.message}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" className={classNames('text-[0.85rem] text-red-600', compact ? '' : 'sm:col-span-2')}>
          {formError}
        </p>
      ) : null}

      <div className={compact ? '' : 'sm:col-span-2'}>
        <Button type="submit" full icon="arrowRight" disabled={status === 'submitting'} data-autofocus>
          {status === 'submitting' ? 'Sending…' : submitLabel || (isViewing ? 'Request viewing' : 'Send enquiry')}
        </Button>
        <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
          By sending this enquiry you agree to be contacted about your property search. We never share
          your details with third parties.
        </p>
      </div>
    </form>
  );
}
