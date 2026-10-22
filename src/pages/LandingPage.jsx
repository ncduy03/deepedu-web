import Header from '../sections/Header.jsx';
import Hero from '../sections/Hero.jsx';
import Problems from '../sections/Problems.jsx';
import Solutions from '../sections/Solutions.jsx';
import TechStack from '../sections/TechStack.jsx';
import Vision from '../sections/Vision.jsx';
import Partners from '../sections/Partners.jsx';
import CallToAction from '../sections/CallToAction.jsx';
import Footer from '../sections/Footer.jsx';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problems />
        <Solutions />
        <TechStack />
        <Vision />
        <Partners />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
