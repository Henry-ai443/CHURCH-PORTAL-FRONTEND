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
            background: rgba(10, 35, 75, 0.3); /* translucent navy-blue */
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            color: #e0e7ff; /* light bluish text */
            padding: 3rem 2rem 2rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(16, 52, 166, 0.25);
            max-width: 1200px;
            margin: 2rem auto;
          }
          .container {
            width: 100%;
          }
          .slogan {
            margin-bottom: 2rem;
          }
          .slogan-header {
            font-weight: 700;
            font-size: 1.8rem;
            color: #a3c4f3; /* soft blue */
            letter-spacing: 2px;
            margin-bottom: 0.4rem;
            text-shadow: 0 0 6px rgba(163, 196, 243, 0.6);
          }
          .slogan-subtitle {
            font-style: italic;
            font-weight: 500;
            font-size: 1.1rem;
            color: #b8c7f0;
            margin: 0;
          }
          .quick-links h6,
          .socials h6 {
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #a3c4f3;
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
            color: #dbe4ff;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            font-size: 1rem;
          }
          nav.quick-links ul li a:hover {
            color: #82aaff;
            text-shadow: 0 0 8px #82aaff;
            text-decoration: underline;
          }
          .social-icons {
            display: flex;
            gap: 1.2rem;
            font-size: 1.4rem;
          }
          .social-icons a {
            color: #dbe4ff;
            border: 1.5px solid rgba(219, 228, 255, 0.4);
            padding: 8px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: 
              color 0.3s ease, 
              border-color 0.3s ease,
              box-shadow 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.15);
          }
          .social-icons a:hover {
            color: #82aaff;
            border-color: #82aaff;
            box-shadow:
              0 0 12px #82aaff,
              inset 0 0 8px rgba(130, 170, 255, 0.5);
            background: rgba(130, 170, 255, 0.15);
          }
          .bottom-strip {
            margin-top: 3rem;
            font-size: 0.9rem;
            color: #99aaffcc;
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 1rem;
            font-family: 'Arial', sans-serif;
            letter-spacing: 0.5px;
            user-select: none;
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
