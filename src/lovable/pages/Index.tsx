import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Development } from "../components/Development";
// import { Contact } from "@/components/Contact";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Development />
      {/* <Contact /> */}
      <Footer />
    </div>
  );
};

export default Index;
