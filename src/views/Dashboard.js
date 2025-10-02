import React from 'react';
import { Hero } from "../lovable/components/Hero";
import { Features } from "../lovable/components/Features";
import { Development } from "../lovable/components/Development";
import { Footer } from "../lovable/components/Footer";
import { Navbar } from "../lovable/components/Navbar";

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
