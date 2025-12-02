import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroSection from "./_components/HeroSection";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import Testimonials from "./_components/Testimonials";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      <HeroSection />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
    <Footer/>
    </>
  );
}
