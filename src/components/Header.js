// src/components/Header.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    console.log("Toggling mobile menu"); // Debugging log
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false); // Close dropdown if mobile menu is toggled
  };

  const toggleDropdownMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggling dropdown menu"); // Debugging log
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <Link to="/">
          <img src="images/nsbe-logo.png" alt="NSBE Logo" className="nsbe-logo" />
        </Link>
      </div>

      <div className="header-right">
        <nav className="desktop-nav">
          <ul>
            <li><Link to="/">Welcome</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/timeline">Timeline</Link></li>
            <li className="dropdown">
              <button className="dropbtn" onClick={toggleDropdownMenu}>
                Programming
              </button>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/awards">Awards</Link>
                  <Link to="/competitions">Competitions</Link>
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="search-social">
          <form action="#" className="search-form">
            <input type="text" placeholder="Search" />
            <button type="submit">🔍</button>
          </form>
          <div className="social-icons">
            <a href="https://www.facebook.com/nsbeconvention">
              <img src="images/facebook-app-round-white-icon.webp" alt="Facebook" />
            </a>
            <a href="https://www.instagram.com/nsbeconvention">
              <img src="images/instagram-new.png" alt="Instagram" />
            </a>
            <a href="https://www.linkedin.com/company/national-society-of-black-engineers/mycompany/">
              <img src="images/linkedin.png" alt="LinkedIn" />
            </a>
            <a href="https://twitter.com/nsbeconvention">
              <img src="images/x-social-media-white-icon.png" alt="X" />
            </a>
            <a href="https://outlook.office.com/mail/deeplink/compose?mailtouri=mailto%3Anational_partnerships%40nsbe.org">
              <img src="images/email-5-xxl.png" alt="Email" />
            </a>
          </div>
        </div>
      </div>

      <div className="mobile-social-icons">
        <a href="https://www.facebook.com/nsbeconvention">
          <img src="images/facebook-app-round-white-icon.webp" alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/nsbeconvention">
          <img src="images/instagram-new.png" alt="Instagram" />
        </a>
        <a href="https://www.linkedin.com/company/national-society-of-black-engineers/mycompany/">
          <img src="images/linkedin.png" alt="LinkedIn" />
        </a>
        <a href="https://twitter.com/nsbeconvention">
          <img src="images/x-social-media-white-icon.png" alt="X" />
        </a>
        <a href="https://outlook.office.com/mail/deeplink/compose?mailtouri=mailto%3Anational_partnerships%40nsbe.org">
          <img src="images/email-5-xxl.png" alt="Email" />
        </a>
      </div>

      <div className="hamburger" onClick={toggleMobileMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav" id="mobileMenu">
          <Link to="/">Welcome</Link>
          <Link to="/about">About</Link>
          <Link to="/timeline">Timeline</Link>
          <button onClick={toggleDropdownMenu} className="dropbtn-mobile">
            Programming
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content-mobile">
              <Link to="/awards">Awards</Link>
              <Link to="/competitions">Competitions</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
