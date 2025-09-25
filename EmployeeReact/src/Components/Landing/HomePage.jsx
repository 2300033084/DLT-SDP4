import React from "react";
import { Link } from "react-router-dom";

import "../css/HomePage.css";
import HomeNavbar from "../NavBars/HomeNavbar";
import Footer from "./Footer";
const HomePage = () => {
  const cards = [
    { index: 0, color: "252, 252, 252", image: "/images/adobe.jpeg" },
    { index: 1, color: "252, 252, 252", image: "/images/amazon-logo.jpeg" },
    {
      index: 2,
      color: "252, 252, 252",
      image: "/images/apple-company-logo.jpeg",
    },
    { index: 3, color: "252, 252, 252", image: "/images/facebook-logo.jpeg" },
    { index: 4, color: "252, 252, 252", image: "/images/ibm-logo.jpeg" },
    { index: 5, color: "252, 252, 252", image: "/images/intel.jpeg" },
    { index: 6, color: "252, 252, 252", image: "/images/microsoft-logo.jpg" },
    { index: 7, color: "252, 252, 252", image: "/images/netflix.jpg" },
    { index: 8, color: "252, 252, 252", image: "/images/tesla.jpg" },
    { index: 9, color: "252, 252, 252", image: "/images/Google_2015_logo.jpg" },
  ];

  return (
    <div>
      <div className="hero-section">
        <div className="navbar-overlay">
          <HomeNavbar />
        </div>
        <img src="/images/bg-Image-1.jpg" alt="My Image" className="background-image" />
        <div className="hero-text">
          <h3>Streamline Your Workforce Management</h3>
          <h1>Effortless Employee Administration</h1>
          <p>
            Managing employee data has never been easier. Our system helps
            organizations handle personal details, job roles, salaries, and
            attendance <br></br>seamlessly.
          </p>
          <Link to="/signup">
            <button
              type="button"
              class="btn btn-primary rounded-pill btn-lg"
              style={{ padding: "20px", fontFamily: "Lexend" }}
            >
              Get Started!
            </button>
          </Link>
          <Link to="/contact">
          <button
            type="button"
            class="btn btn-light rounded-pill btn-lg"
            style={{ padding: "20px", fontFamily: "Lexend" }}
          >
            Chat with us
          </button>
          </Link>
        </div>
      </div>
      <div className="about-section">
        <div className="container-about">
          <div className="row-1">
            <div className="heading-1">
              <i class="bi bi-buildings-fill"></i>
              <h4>About Our System</h4>
            </div>
            <div className="heading-2">
              <h2>Where Efficiency Meets Innovation</h2>
            </div>
            <p>
              Managing employees has never been easier. Our system streamlines
              workforce management by handling personal details, job roles,
              salaries, and attendance records with ease. HR teams can
              efficiently update employee profiles, assign roles, and track
              performance, while employees can access their dashboards for
              payslips, leave applications, and profile updates—all in one
              place.
            </p>
            <Link to="/features">
              <button
                type="button"
                class="btn btn-primary rounded-pill btn-lg"
                style={{ padding: "18px", fontFamily: "Lexend" }}
              >
                Our Features!
              </button>
            </Link>
          </div>
          <div className="row-2">
            <div className="quote-card">
              <p className="quote-icon heading">
                <i className="bi bi-quote"></i>
              </p>
              <h3>Empowering Organizations with Smart Solutions</h3>
              <p>
                Our system goes beyond traditional management, offering secure
                data handling, role-based access, and seamless integration to
                enhance workplace operations.
              </p>
              {/* */}
              <p className="quote-author">- Lead Developer</p>
            </div>
          </div>
        </div>
      </div>
      <div className="companies-section">
        <h2 className="section-heading">Our Trusted Partners</h2>
        <p className="section-description">
          We collaborate with industry-leading companies to bring you the best
          workforce management solutions.
        </p>
        <div className="wrapper">
          <div className="inner">
            {cards.map((card) => (
              <div
                key={card.index}
                className="company-card"
                style={{
                  "--index": card.index,
                  "--color-card": card.color,
                }}
              >
                <div className="img">
                  <img
                    src={card.image}
                    alt="Company Logo"
                    className="company-logo"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
