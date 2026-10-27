import PageHeader from '../components/layout/PageHeader.jsx';
import CtaSection from '../components/home/CtaSection.jsx';
import TeamCard from '../components/team/TeamCard.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getAgents } from '../lib/api.js';

export default function Team() {
  const { data, loading, error, retry } = useAsyncData(() => getAgents(), []);
  const agents = data?.items || [];

  return (
    <>
      <PageHeader
        label="Our Team"
        title="Meet the Team"
        description="Four advisors, one standard of care. Whoever takes your first call is the person who negotiates your deal and stays with it to completion."
      />

      <div className="bg-white pb-20 pt-14 lg:pb-28 lg:pt-20">
        <div className="shell">
          {error ? (
            <div className="rounded-panel border border-navy/10 bg-mist px-6 py-16 text-center">
              <h2 className="font-display text-display-sm">We could not load the team</h2>
              <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-ink-soft">
                Please refresh the page or call our office on (555) 246-7890.
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-6 font-display text-[0.85rem] font-semibold text-navy underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} aria-hidden="true">
                      <div className="aspect-[4/5] animate-pulse rounded-image bg-navy/5" />
                      <div className="mt-5 h-4 w-2/3 animate-pulse rounded bg-navy/10" />
                      <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-navy/10" />
                    </div>
                  ))
                : agents.map((agent, index) => (
                    <Reveal key={agent.slug} delay={index * 80}>
                      <TeamCard agent={agent} />
                    </Reveal>
                  ))}
            </div>
          )}
        </div>
      </div>

      <CtaSection
        title="Prefer to speak with someone first?"
        description="Call our Austin office or send a message — we will match you with the right advisor."
        buttonLabel="Contact us"
      />
    </>
  );
}
