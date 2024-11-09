import React from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-left">
          <Link to="/">
            <img src="images/nsbe-logo.png" alt="NSBE Logo" className="nsbe-logo" />
          </Link>
          <address>
            <strong>National Society of Black Engineers</strong><br />
            987 Engineering Way<br />
            Silicon Valley, CA 94043<br />
            (888) 987-6543
          </address>
          <p>&copy; Copyright Convention.nsbe.org 2024</p>
        </div>

        <div className="footer-right">
          <ul>
            <li><a href="https://nsbe.org/k-12">Elementary & K-12</a></li>
            <li><a href="https://nsbe.org/home/collegiate/">Programs</a></li>
            <li><a href="https://nsbe.org/home/professionals/">University Level</a></li>
            <li><a href="https://nsbe.org/home/partnerships/">Professional Development</a></li>
            <li><a href="https://nsbe.org/membership/">Corporate Partnerships</a></li>
            <li><a href="https://nsbe.org/membership/">Member Resources</a></li>
            <li><a href="https://convention.nsbe.org/">Conference Events</a></li>
          </ul>
          <div className="contact-button">
            <Link to="/contact">
              <button>Contact Us</button>
            </Link>
          </div>
        </div>
      </footer>

      <div className="footer-links">
        <Link to="/terms">Terms & Conditions</Link> |
        <Link to="/privacy">Privacy Policy</Link> |
        <Link to="/contact">Contact us</Link>
      </div>

      <div className="social-media">
        <a href="https://www.facebook.com/nsbeconvention"><img src="images/antOutline-facebook 1.png" alt="Facebook" /></a>
        <a href="https://www.instagram.com/nsbeconvention"><img src="images/antOutline-instagram 1.png" alt="Instagram" /></a>
        <a href="https://www.linkedin.com/company/national-society-of-black-engineers/mycompany/"><img src="images/antFill-linkedin 1.png" alt="LinkedIn" /></a>
        <a href="https://twitter.com/nsbeconvention"><img src="images/X.webp" alt="X" /></a>
      </div>
    </>
  );
}

export default Footer;
