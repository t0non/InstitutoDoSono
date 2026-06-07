import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import HighlightsBar from '@/components/landing/highlights-bar';
import Doctors from '@/components/landing/doctors';
import Services from '@/components/landing/services';
import SmartChat from '@/components/landing/smart-chat';
import ClinicHistory from '@/components/landing/ClinicHistory';
import Insurance from '@/components/landing/Insurance';
import Reviews from '@/components/landing/Reviews';
import MobileStickyBar from '@/components/landing/MobileStickyBar';
import Faq from '@/components/landing/Faq';
import Location from '@/components/landing/location';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HighlightsBar />
        <ClinicHistory />
        <Insurance />
        <Services />
        <Doctors />
        <Reviews />
        <Faq />
        <Location />
      </main>
      <Footer />
      <MobileStickyBar />
      <SmartChat />
    </>
  );
}
