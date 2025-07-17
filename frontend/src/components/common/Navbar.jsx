import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { scroller } from "react-scroll";
import { FaBars, FaTimes, FaHome, FaChevronRight } from "react-icons/fa";
import Button from "./Button";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");   
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Section IDs for scroll tracking
  const sectionIds = ["home", "about", "plans", "trainers", "contact"];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
      // Only track section on landing page
      if (location.pathname === "/") {
        let found = "home";
        for (let i = 0; i < sectionIds.length; i++) {
          const el = document.getElementById(sectionIds[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom > 80) {
              found = sectionIds[i];
              break;
            }
          }
        }
        setCurrentSection(found);
      }
    };
    const handleResize = () => window.innerWidth >= 768 && closeMenu();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  const handleNavClick = (targetId) => {
    setCurrentSection(targetId);
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

  // For non-landing pages, highlight based on route
  const getActiveSection = () => {
    if (location.pathname !== "/") {
      if (location.pathname.startsWith("/about")) return "about";
      if (location.pathname.startsWith("/plans")) return "plans";
      if (location.pathname.startsWith("/trainers")) return "trainers";
      if (location.pathname.startsWith("/contact")) return "contact";
      return "";
    }
    return currentSection;
  };
  const activeSection = getActiveSection();

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

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${
      isSticky 
        ? "bg-black/20 backdrop-blur-xl border-b border-white/10" 
        : "bg-transparent"
    }`}>
     
      {/* Main Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center" role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Go to home section"
        >
          Levels Gym
        </button>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <button 
            onClick={() => handleNavClick("home")}
            className={`text-white hover:text-red-400 transition-colors duration-300 font-medium ${activeSection === "home" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
            aria-current={activeSection === "home" ? "page" : undefined}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick("about")}
            className={`text-white hover:text-red-400 transition-colors duration-300 font-medium ${activeSection === "about" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
            aria-current={activeSection === "about" ? "page" : undefined}
          >
            About
          </button>
          <button 
            onClick={() => handleNavClick("plans")}
            className={`text-white hover:text-red-400 transition-colors duration-300 font-medium ${activeSection === "plans" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
            aria-current={activeSection === "plans" ? "page" : undefined}
          >
            Plans
          </button>
          <button 
            onClick={() => handleNavClick("trainers")}
            className={`text-white hover:text-red-400 transition-colors duration-300 font-medium ${activeSection === "trainers" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
            aria-current={activeSection === "trainers" ? "page" : undefined}
          >
            Trainers
          </button>
          <button 
            onClick={() => handleNavClick("contact")}
            className={`text-white hover:text-red-400 transition-colors duration-300 font-medium ${activeSection === "contact" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
            aria-current={activeSection === "contact" ? "page" : undefined}
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
          className="md:hidden text-white p-3 rounded-lg hover:text-red-300 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 shadow-2xl"
            style={{ minHeight: '100vh' }}
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <div className="px-5 py-8 space-y-6 flex flex-col">
              <button 
                onClick={() => { handleNavClick("home"); closeMenu(); }}
                className={`block w-full text-left text-white text-lg font-semibold hover:text-red-400 transition-colors duration-300 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${activeSection === "home" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
                role="menuitem"
                aria-current={activeSection === "home" ? "page" : undefined}
              >
                Home
              </button>
              <button 
                onClick={() => { handleNavClick("about"); closeMenu(); }}
                className={`block w-full text-left text-white text-lg font-semibold hover:text-red-400 transition-colors duration-300 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${activeSection === "about" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
                role="menuitem"
                aria-current={activeSection === "about" ? "page" : undefined}
              >
                About
              </button>
              <button 
                onClick={() => { handleNavClick("plans"); closeMenu(); }}
                className={`block w-full text-left text-white text-lg font-semibold hover:text-red-400 transition-colors duration-300 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${activeSection === "plans" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
                role="menuitem"
                aria-current={activeSection === "plans" ? "page" : undefined}
              >
                Plans
              </button>
              <button 
                onClick={() => { handleNavClick("trainers"); closeMenu(); }}
                className={`block w-full text-left text-white text-lg font-semibold hover:text-red-400 transition-colors duration-300 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${activeSection === "trainers" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
                role="menuitem"
                aria-current={activeSection === "trainers" ? "page" : undefined}
              >
                Trainers
              </button>
              <button 
                onClick={() => { handleNavClick("contact"); closeMenu(); }}
                className={`block w-full text-left text-white text-lg font-semibold hover:text-red-400 transition-colors duration-300 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${activeSection === "contact" ? "text-red-400 font-bold underline underline-offset-4" : ""}`}
                role="menuitem"
                aria-current={activeSection === "contact" ? "page" : undefined}
              >
                Contact
              </button>
              <div className="pt-6 border-t border-white/10 space-y-4">
                <Button 
                  title="Login" 
                  link="/login"
                  className="block w-full text-left text-white text-lg font-semibold hover:text-red-400 transition-colors duration-300 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={closeMenu}
                  role="menuitem"
                />
                <Button 
                  title="Sign Up" 
                  link="/signup"
                  className="block w-full bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white hover:bg-red-500/30 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={closeMenu}
                  role="menuitem"
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
          <nav aria-label="Breadcrumb">
            <div className="container mx-auto px-6 py-3">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors duration-300"
                  >
                    <FaHome className="text-xs" />
                    <span>Home</span>
                  </Link>
                </li>
                {pathnames.map((name, index) => {
                  const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;
                  return (
                    <React.Fragment key={name}>
                      <li aria-hidden="true">
                        <FaChevronRight className="text-gray-500 text-xs" />
                      </li>
                      <li aria-current={isLast ? "page" : undefined}>
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
                      </li>
                    </React.Fragment>
                  );
                })}
              </ol>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
