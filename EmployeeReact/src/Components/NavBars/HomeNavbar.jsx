import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/HomeNavbar.css";

const HomeNavbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) {
      setIsSticky(true); // Always sticky on non-home pages
      return;
    }

    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  return (
    <nav className={`navbar ${isSticky ? "sticky" : ""} ${!isHomePage ? "non-home" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" >
          Crew Connect 360
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links" style={{fontFamily: "Lexend" }}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-links" style={{fontFamily: "Lexend" }}>About</Link>
          </li>
          <li className="nav-item">
            <Link to="/faq" className="nav-links" style={{fontFamily: "Lexend" }}>FAQ</Link>
          </li>
          <li className="nav-item">
            <Link to="/features" className="nav-links" style={{fontFamily: "Lexend" }}>Features</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" style={{fontFamily: "Lexend" }}>Contact Us</Link>
          </li>
         
        </ul>
        <Link
          to="/login"
          className="btn btn-primary rounded-pill login-button"
          style={{ padding: "11px", fontFamily: "Lexend" }}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="btn btn-outline-light rounded-pill signup-button"
          style={{ padding: "11px", fontFamily: "Lexend" }}
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavbar;
