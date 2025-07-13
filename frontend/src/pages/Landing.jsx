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
      <section id="home">
        <Home />
      </section>

      {/* About Section */}
      <section id="about">
        <About />
      </section>

      {/* Plans Section */}
      <section id="plans">
        <Plans />
      </section>

      {/* Trainers Section */}
      <section id="trainers">
        <Trainers />
      </section>

      {/* Contact Section */}
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
};

export default Landing; 