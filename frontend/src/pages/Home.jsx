import AboutSection from '../components/home/AboutSection.jsx';
import CtaSection from '../components/home/CtaSection.jsx';
import FeaturedSection from '../components/home/FeaturedSection.jsx';
import Hero from '../components/home/Hero.jsx';
import ServicesSection from '../components/home/ServicesSection.jsx';
import TeamSection from '../components/home/TeamSection.jsx';
import WhyChooseSection from '../components/home/WhyChooseSection.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedSection />
      <ServicesSection />
      <WhyChooseSection />
      <TeamSection />
      <CtaSection />
    </>
  );
}
