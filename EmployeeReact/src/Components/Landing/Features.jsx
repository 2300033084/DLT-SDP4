import React,{useEffect} from "react";
import HomeNavbar from "../NavBars/HomeNavbar";
import "../css/Features.css";
import Footer from "./Footer";
const featuresList = [
  {
    title: "User Authentication",
    description: "Secure login/signup for admins, HR, and employees.",
    icon: "bi-shield-lock",
  },
  {
    title: "Employee Records",
    description: "Add, update, delete, and view employee details.",
    icon: "bi-person-lines-fill",
  },
  {
    title: "Attendance Tracking",
    description: "Log daily attendance and track working hours.",
    icon: "bi-calendar-check",
  },
  {
    title: "Leave Management",
    description: "Employees can apply for leave, HR can approve or reject.",
    icon: "bi-clipboard-check",
  },
  {
    title: "Payroll Management",
    description: "Generate and manage salaries, deductions, and bonuses.",
    icon: "bi-cash-stack",
  },
  {
    title: "Performance Reviews",
    description: "HR and managers can provide feedback and ratings.",
    icon: "bi-bar-chart-line",
  },
  {
    title: "Role-Based Access",
    description: "Different permissions for admins, HR, and employees.",
    icon: "bi-key",
  },
  {
    title: "Department Management",
    description: "Create and manage departments, assign employees.",
    icon: "bi-diagram-3",
  },
  {
    title: "Document Management",
    description: "Store and manage employee contracts and IDs.",
    icon: "bi-file-earmark-text",
  },
];
const Features = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    const featureCards = document.querySelectorAll(".features-card");
    featureCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
        <HomeNavbar />
        {/* */}
      <div className="row features">
        <div className="col-md-6" >
          <h2 className="typewriter">Features</h2>
        </div>
        <div className="col-md-6"> 
          <p>
            Our Employee Management System streamlines workforce operations with
            advanced automation and real-time analytics.</p><br></br><p> Experience seamless
            employee tracking, role-based access, and efficient payroll
            management.
          </p>
        </div>
      </div>
      <div className="features-container">
      {featuresList.map((feature, index) => (
          <div key={index} className="features-card">
            <div className="icon-container">
              <i className={`bi ${feature.icon}`}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Features;
