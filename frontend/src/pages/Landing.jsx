import React from "react";
import Home from "./Home";
import About from "./About";
import Plans from "./Plans";
import Trainers from "./Trainers";
import Contact from "./Contact";

const Landing = () => {
  return (
    <div className="relative">
      {/* Home Section */}
      <section id="home" className="px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16">
        <Home />
      </section>

      {/* About Section */}
      <section id="about" className="px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16">
        <About />
      </section>

      {/* Plans Section */}
      <section id="plans" className="px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16">
        <Plans />
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16">
        <Trainers />
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16">
        <Contact />
      </section>
    </div>
  );
};

export default Landing; 