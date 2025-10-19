import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center">
          {/* Left - Slogan */}
          <div className="slogan text-center text-lg-start">
            <h4 className="slogan-header">Church Of God 7th Day</h4>
            <p className="slogan-subtitle">Connecting faith, community & hope.</p>
          </div>

          {/* Center - Quick Links */}
          <nav className="quick-links" aria-label="Footer navigation">
            <h6>Quick Links</h6>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/announcements">Announcements</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/sermons">Sermons</a></li>
              <li><a href="/donations">Donations</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>

          {/* Right - Social Media */}
          <div className="socials">
            <h6>Follow Us</h6>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
        </div>

        <div className="bottom-strip">
          &copy;{new Date().getFullYear()} NOVA WORKS SOFTWARES. All rights reserved.
        </div>

        <style>{`
          .footer {
            background-color: #0b1421; /* Deep navy */
            color: #d4cfc9; /* Light muted beige */
            padding: 3rem 2rem 2rem;
            font-family: 'Georgia', serif;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }
          .slogan {
            margin-bottom: 2rem;
          }
          .slogan-header {
            font-weight: 700;
            font-size: 1.8rem;
            color: #c9b37e; /* Muted gold */
            letter-spacing: 2px;
            margin-bottom: 0.4rem;
          }
          .slogan-subtitle {
            font-style: italic;
            font-weight: 500;
            font-size: 1.1rem;
            color: #aaa196;
            margin: 0;
          }
          .quick-links h6,
          .socials h6 {
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #c9b37e;
          }
          nav.quick-links ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          nav.quick-links ul li {
            margin-bottom: 0.7rem;
          }
          nav.quick-links ul li a {
            color: #d4cfc9;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
            font-size: 1rem;
          }
          nav.quick-links ul li a:hover {
            color: #c9b37e;
            text-decoration: underline;
          }
          .social-icons {
            display: flex;
            gap: 1.2rem;
            font-size: 1.4rem;
          }
          .social-icons a {
            color: #d4cfc9;
            transition: color 0.3s ease;
            border: 1.5px solid transparent;
            padding: 8px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .social-icons a:hover {
            color: #c9b37e;
            border-color: #c9b37e;
            background-color: rgba(201, 179, 126, 0.15);
          }
          .bottom-strip {
            margin-top: 3rem;
            font-size: 0.9rem;
            color: #7a7466;
            text-align: center;
            border-top: 1px solid #2f2c24;
            padding-top: 1rem;
            font-family: 'Arial', sans-serif;
            letter-spacing: 0.5px;
          }
          /* Responsive */
          @media (max-width: 767px) {
            .container {
              flex-direction: column;
              text-align: center;
            }
            .slogan {
              margin-bottom: 2rem;
            }
            .social-icons {
              justify-content: center;
              margin-top: 0.5rem;
            }
          }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;
