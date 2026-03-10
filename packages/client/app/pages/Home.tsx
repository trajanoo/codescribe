import Navbar from '@/app/components/landing/Navbar';
import HeroSection from '@/app/components/landing/HeroSection';
import HowItWorks from '@/app/components/landing/HowItWorks';
import FeaturesGrid from '@/app/components/landing/FeaturesGrid';
import AudienceSection from '@/app/components/landing/AudienceSection';
import CTAFooter from '@/app/components/landing/CTAFooter';
import PricingSection from '@/app/components/landing/PricingSection';

export default function Home() {
  return (
    <div className="bg-[#07070f] min-h-screen scroll-smooth">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesGrid />
      <AudienceSection />
      <PricingSection />
      <CTAFooter />
    </div>
  );
}