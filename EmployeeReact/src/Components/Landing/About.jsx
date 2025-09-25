import React from "react";
import HomeNavbar from "../NavBars/HomeNavbar";
import "../css/About.css";
import Footer from "./Footer";
const About = () => {
  return (
    <div>
      <HomeNavbar />
      <div className="container-aboutus">
        <div className="container-image">
          <img src="/images/about-image.jpg" alt="about" />
          <div className="container-card">
            <h2>About Us</h2>
            <p>
              Our Employee Management System is designed to streamline workforce
              operations, making employee data management efficient and
              hassle-free.
            </p>
          </div>
        </div>
      </div>
      <div className="about-us">
        <div className="about-us-card">
          <div className="about-us-card-text">
            <h4><i class="bi bi-shield-plus" style={{color:'blue',marginRight:'5px',fontSize:'28px'}}></i> Security</h4>
            <h2>
              {" "}
               Secure & Reliable
            </h2>
            <p>
              Our system ensures top-notch security with JWT authentication,
              role-based access control, and encrypted data storage.</p><br></br><p> Designed
              for reliability, it safeguards sensitive employee information
              while maintaining seamless access for authorized users.
            </p>
          </div>
          <div className="about-us-card-image">
            <img src="/images/security.jpg" className="image" alt="secure" />
          </div>
        </div>
        <div className="about-us-card">
          <div className="about-us-card-image">
            <img src="/images/roles.png" className="image" alt="efficient" />
          </div>
          <div className="about-us-card-text">
            <h4><i class="bi bi-person-plus" style={{color:'orange',marginRight:'5px',fontSize:'28px'}}></i> Access Control</h4>
            <h2>
               Role-Based Access
            </h2>
            <p>
              Customized access levels ensure that administrators, HR managers,
              and employees have permissions tailored to their responsibilities.</p><br></br>
              <p>
              This enhances data privacy and operational efficiency within the
              organization.
            </p>
          </div>
        </div>
        <div className="about-us-card">
          <div className="about-us-card-text">
            <h4><i class="bi bi-clock" style={{color:'green',marginRight:'5px',fontSize:'28px'}}></i> Workforce Efficiency
            </h4>
            <h2>
               Efficient Management
            </h2>
            <p>
              Our platform streamlines attendance tracking, leave management,
              and payroll administration, reducing manual effort and improving
              productivity.</p><br></br> <p>With an intuitive dashboard, organizations can
              easily manage workforce operations in real time.
            </p>
          </div>
          <div className="about-us-card-image">
            <img
              src="/images/efficiency.jpg"
              className="image"
              alt="efficient"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
