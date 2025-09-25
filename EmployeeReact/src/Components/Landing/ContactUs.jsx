import React from "react";
import HomeNavbar from "../NavBars/HomeNavbar";
import "../css/ContactUs.css";
const ContactUs = () => {
  return (
    <div>
      <HomeNavbar />
      <div className="main-contactus">
        <div className="contactus-form col-md-8">
          <h4>We’d Love To Hear From You</h4>
          <p>
            Our Employee Management System is designed to simplify workforce
            operations and enhance productivity. Reach out to us for
            any assistance related to employee data management, role-based
            access, payroll, or system customization.
          </p>
          <div className="contact-us-form">
            <form class="row g-3">
              <div class="col-md-6">
                <label for="inputText-First" class="form-label">
                  FirstName
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="inputText-First"
                ></input>
              </div>
              <div class="col-md-6">
                <label for="inputText-Last" class="form-label">
                  LastName
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="inputText-Last"
                ></input>
              </div>
              <div class="col-md-6">
                <label for="inputEmail4" class="form-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="inputEmail4"
                ></input>
              </div>
              <div class="col-md-6">
                <label for="inputPhone" class="form-label">
                  Phone
                </label>
                <input type="text" class="form-control" id="inputPhone"></input>
              </div>
              <div class="col-md-12 mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">
                  TextArea
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg rounded-pill" style={{width:'120px'}}>
                Submit
              </button>
            </form>
          </div>
        </div>
        <div className="contactus-info col-md-4">
          <div className="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.6645995502554!2d80.62035802491249!3d16.44185193429294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a7d81943%3A0x8ba5d78f65df94b8!2sK%20L%20E%20F%20Deemed%20To%20Be%20University!5e0!3m2!1sen!2sin!4v1739297372839!5m2!1sen!2sin"
              width="400"
              height="250"
              style={{ border: "0" }} // FIX: JSX requires an object for style
              allowFullScreen // FIX: Boolean attributes should not have values
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade" // FIX: JSX uses camelCase
            ></iframe>
          </div>
          <div className="contact-numbers">
            <h4>
              <i class="bi bi-telephone-outbound-fill"></i>General Inquiries -
              (849) 516-0885
            </h4>
            <h4>
              <i class="bi bi-telephone-outbound-fill" ></i>Enrollment Inquiries
              - 1-855-475-0885
            </h4>
            <h4>
              <i class="bi bi-telephone-outbound-fill"></i>Financial Inquiries -
              (849) 516-0885
            </h4>

            <h4>
              <i class="bi bi-telephone-outbound-fill"></i>Account Inquiries -
              (849) 516-0885
            </h4>
            <h4>
            <i class="bi bi-geo-alt-fill"></i>KL University, Vaddeswaram, Guntur, AP
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
