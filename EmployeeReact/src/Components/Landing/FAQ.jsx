import React from "react";
import "../css/FAQ.css";
import HomeNavbar from "../NavBars/HomeNavbar";
import Footer from "./Footer";

const faqs = [
  { id: 1, question: "What is the purpose of this EMS?", answer: "The Employee Management System (EMS) helps organizations manage employee records, attendance, payroll, and performance efficiently." },
  { id: 2, question: "How can I add a new employee?", answer: "To add an employee, go to the Admin Dashboard, navigate to 'Employees', and click 'Add Employee'. Fill in the details and save." },
  { id: 3, question: "Can employees update their profiles?", answer: "Yes, employees can update their profiles by logging in and accessing the 'Profile' section in the dashboard." },
  { id: 4, question: "Does this system support payroll management?", answer: "Yes, the system automates payroll calculations, including salaries, deductions, and tax calculations." },
  { id: 5, question: "How does the leave management work?", answer: "Employees can apply for leaves via the system, and managers can approve or reject leave requests through the dashboard." },
  { id: 6, question: "Can managers track employee attendance?", answer: "Yes, managers can view daily, weekly, and monthly attendance records from the attendance module." },
  { id: 7, question: "Is there role-based access control?", answer: "Yes, EMS provides role-based access, where admins, managers, and employees have different permission levels." },
  { id: 8, question: "How secure is employee data?", answer: "The EMS uses encryption and authentication mechanisms to ensure data security and privacy." },
  { id: 9, question: "Can reports be generated?", answer: "Yes, detailed reports on attendance, payroll, and employee performance can be generated and exported." },
];

const FAQ = () => {
  return (
    <div>
      <HomeNavbar />
      <div className="container-faq mt-5">
        <div className="row">
          <div className="">
            <h2 className="faq-heading">Popular - FAQs</h2>
          </div>
          
          
        </div>

        {/* Bootstrap Accordion for FAQs */}
        <div className="accordion mt-4" id="accordionPanelsStayOpenExample">
          {faqs.map((faq, index) => (
            <div className="accordion-item" key={faq.id}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="{index === 0 ? 'true' : 'false'}"
                  aria-controls={`collapse${index}`}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                data-bs-parent="#accordionPanelsStayOpenExample"
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default FAQ;
