import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { scroller } from "react-scroll";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaHome, FaChevronRight } from "react-icons/fa";
import Button from "./Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 0);
    const handleResize = () => window.innerWidth >= 768 && closeMenu();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavClick = (targetId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo(targetId, {
          duration: 500,
          smooth: true,
          offset: -70,
        });
      }, 100);
    } else {
      scroller.scrollTo(targetId, {
        duration: 500,
        smooth: true,
        offset: -70,
      });
    }
    closeMenu();
  };

  const getBreadcrumbName = (path) => {
    const nameMap = {
      login: "Login",
      signup: "Sign Up",
      about: "About Us",
      plans: "Pricing Plans",
      contact: "Contact Us",
      admin: "Admin Dashboard",
      trainer: "Trainer Dashboard",
      user: "User Dashboard",
    };
    return nameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const pathnames = location.pathname.split("/").filter((x) => x);
  const showBreadcrumb = pathnames.length > 0 && location.pathname !== "/";

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${
      isSticky 
        ? "bg-black/20 backdrop-blur-xl border-b border-white/10" 
        : "bg-transparent"
    }`}>
      {/* Main Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <span
          onClick={() => handleNavClick("home")}
          className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          Levels Gym
        </span>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <button 
            onClick={() => handleNavClick("home")}
            className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick("about")}
            className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
          >
            About
          </button>
          <button 
            onClick={() => handleNavClick("plans")}
            className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
          >
            Plans
          </button>
          <button 
            onClick={() => handleNavClick("trainers")}
            className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
          >
            Trainers
          </button>
          <button 
            onClick={() => handleNavClick("contact")}
            className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
          >
            Contact
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button 
            title="Login" 
            link="/login"
            className="text-white hover:text-red-400 transition-colors duration-300 font-medium"
          />
          <Button 
            title="Sign Up" 
            link="/signup"
            className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 px-6 py-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
          />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-2 hover:text-red-300 transition-all duration-300 hover:scale-110"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-5 py-6 space-y-4">
              <button 
                onClick={() => handleNavClick("home")}
                className="block w-full text-left text-white hover:text-red-400 transition-colors duration-300 font-medium py-2"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick("about")}
                className="block w-full text-left text-white hover:text-red-400 transition-colors duration-300 font-medium py-2"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick("plans")}
                className="block w-full text-left text-white hover:text-red-400 transition-colors duration-300 font-medium py-2"
              >
                Plans
              </button>
              <button 
                onClick={() => handleNavClick("trainers")}
                className="block w-full text-left text-white hover:text-red-400 transition-colors duration-300 font-medium py-2"
              >
                Trainers
              </button>
              <button 
                onClick={() => handleNavClick("contact")}
                className="block w-full text-left text-white hover:text-red-400 transition-colors duration-300 font-medium py-2"
              >
                Contact
              </button>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button 
                  title="Login" 
                  link="/login"
                  className="block w-full text-left text-white hover:text-red-400 transition-colors duration-300 font-medium py-2"
                />
                <Button 
                  title="Sign Up" 
                  link="/signup"
                  className="block w-full bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 px-6 py-3 rounded-xl font-bold transition-all duration-300 text-center shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Breadcrumb Navigation */}
      {showBreadcrumb && (
        <motion.div
          className="bg-black/30 backdrop-blur-xl border-t border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors duration-300"
              >
                <FaHome className="text-xs" />
                <span>Home</span>
              </Link>
              
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                
                return (
                  <React.Fragment key={name}>
                    <FaChevronRight className="text-gray-500 text-xs" />
                    {isLast ? (
                      <span className="text-red-400 font-medium">
                        {getBreadcrumbName(name)}
                      </span>
                    ) : (
                      <Link
                        to={routeTo}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-300"
                      >
                        {getBreadcrumbName(name)}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
