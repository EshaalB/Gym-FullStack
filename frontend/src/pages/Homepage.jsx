import React from "react";
import Home from "./Home";
import About from "./About";
import Plans from "./Plans";
import Contact from "./Contact";

const Homepage = () => {
  return (
    <>
      <section id="home"><Home /></section>
      <section id="about"><About /></section>
      <section id="plans"><Plans /></section>
      <section id="contact"><Contact /></section>
    </>
  );
};

export default Homepage;
