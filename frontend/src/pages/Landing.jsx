import React from "react";
import Home from "./Home";
import About from "./About";
import Plans from "./Plans";
import Trainers from "./Trainers";
import Contact from "./Contact";

const Landing = () => {
  return (
    <div className="relative w-screen min-h-screen flex flex-col overflow-x-hidden">
      {/* Home Section */}
      <section id="home" className="w-screen min-h-screen flex items-center px-0 py-0">
        <Home />
      </section>

      {/* About Section */}
      <section id="about" className="w-screen min-h-screen flex items-center px-0 py-0">
        <About />
      </section>

      {/* Plans Section */}
      <section id="plans" className="w-screen min-h-screen flex items-center px-0 py-0">
        <Plans />
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="w-screen min-h-screen flex items-center px-0 py-0">
        <Trainers />
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-screen min-h-screen flex items-center px-0 py-0">
        <Contact />
      </section>
    </div>
  );
};

export default Landing; 