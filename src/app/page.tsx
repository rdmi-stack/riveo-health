import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Platform from "@/components/Platform";
import Solutions from "@/components/Solutions";
import Architecture from "@/components/Architecture";
import Results from "@/components/Market";
import Company from "@/components/Company";
import Testimonials from "@/components/Testimonials";
import Insights from "@/components/Insights";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Platform />
      <Solutions />
      <Architecture />
      <Results />
      <Company />
      <Testimonials />
      <Insights />
      <CTA />
      <Footer />
    </main>
  );
}
