import { useAsyncData } from '../../hooks/useAsyncData.js';
import { getAgents } from '../../lib/api.js';
import Button from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import TeamCard from '../team/TeamCard.jsx';

export default function TeamSection() {
  const { data, loading } = useAsyncData(() => getAgents(), []);
  const agents = data?.items || [];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading
            align="center"
            label="Our Team"
            title="Advisors Who Know These Homes"
            description="A small, senior team. Whoever answers your first call is the person who negotiates your deal."
          />
        </Reveal>

        {loading ? (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[4/5] animate-pulse rounded-image bg-navy/5" />
                <div className="mt-5 h-4 w-2/3 animate-pulse rounded bg-navy/10" />
                <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-navy/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent, index) => (
              <Reveal key={agent.slug} delay={index * 80}>
                <TeamCard agent={agent} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-14 flex justify-center">
          <Button to="/team" variant="outline" icon="arrowRight">
            Meet the team
          </Button>
        </div>
      </div>
    </section>
  );
}
