import { useState } from 'react';

import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import InquiryForm from './InquiryForm.jsx';

/** Schedule-a-viewing flow, opened from a property page. */
export default function ViewingModal({ property, label = 'Schedule a Viewing', variant = 'outline', size = 'md', full = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} full={full} icon="calendar" onClick={() => setOpen(true)}>
        {label}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Schedule a viewing"
        maxWidth="max-w-xl"
      >
        <p className="text-[0.92rem] leading-relaxed text-ink-soft">
          Choose a date and time that suits you and we will confirm the appointment by email. Private
          viewings are also available outside these hours on request.
        </p>
        <div className="mt-6">
          <InquiryForm
            kind="viewing"
            propertySlug={property?.slug}
            propertyName={property?.name}
            agentName={property?.agent?.name}
            idPrefix="viewing"
            onDone={() => setOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
