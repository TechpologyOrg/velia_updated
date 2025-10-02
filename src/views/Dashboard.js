import React from 'react';
import { Hero } from "../lovable/components/Hero.tsx";
import { Features } from "../lovable/components/Features.tsx";
import { Development } from "../lovable/components/Development.tsx";
import { Footer } from "../lovable/components/Footer.tsx";
import { Navbar } from "../lovable/components/Navbar.tsx";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Development />
      <Footer />
    </div>
  );
}
