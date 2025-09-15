import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
const Footer = () => {
    return(
        <>
        <footer style={{
            background:"rgba(0, 51, 102, 0.6)",
            backdropFilter:"blur(12px)",
            WebkitBackdropFilter:"blur(12px)",
            borderTop:"1px solid rgba(255, 255, 255, 0.2)",
            padding:"40px 20px 10px",
            color:"white",
        }}>
            <div className="container d-flex flex-column flex-lg-row justify-content-betweem align-items-center">
                <div className="mb-3 mb-lg-0 text-center text-lg-start slogan">
                    <h4 className="sloganHeader"  style={{
                        background:"linear-gradient(90deg, #1E90FF, #87CEFA, #ffffff)",
                        WebkitBackgroundClip:"text",
                        WebkitTextFillColor:"transparent",
                        textShadow:"0 0 10px rgba(30, 144, 255, 0.8), 0 0 20px rgba(135, 206, 250, 0.6)",
                        fontWeight:"bold",
                        animation:"shimmer 6s ease-in-out infinite"
                    }}>Church Of God 7th Day</h4>
                    <p className="mb-0 fw-bold">Connecting faith, community & hope.</p>
                </div>

                {/**Center - Quick Links */}
                <div className="col-lg-4 mb-4 quickLinks">
                    <h6 className="fw-bold text-uppercase text-decoration-underline">Quick Links</h6>
                    <ul className="list-unstyled mt-3">
                        <li><a href="/" className="footer-link">Home</a></li>
                        <li><a href="/announcements" className="footer-link">Announcements</a></li>
                        <li><a href="/events" className="footer-link">Events</a></li>
                        <li><a href="" className="footer-link">Sermons</a></li>
                        <li><a href="/" className="footer-link">Donations</a></li>
                        <li><a href="/" className="footer-link">Contact</a></li>
                    </ul>
                </div>

                {/**Right-Social Media */}
                <div className="col-lg-4 mb-4">
                    <h6 className="fw-bold text-uppercase">Follow Us:</h6>
                    <div className="d-flex justify-content-center justify-content-lg-start gap-3 mt-3 socials">
                        <a href="#" className="social-icon"><FaFacebook/></a>
                        <a href="#" className="social-icon"><FaTwitter/></a>
                        <a href="#" className="social-icon"><FaInstagram/></a>
                        <a href="#" className="social-icon"><FaYoutube/></a>
                    </div>
                </div>

                {/**Bottom Strip */}
                <div className="text-center  mt-3 fw-bold py-2 px-1 copy"
                style={{
                    background:"rgba(0, 51, 102, 0.35)",
                    borderTop:"1px solid rgba(255, 255, 255, 0.15)",
                    fontSize:"0.85rem",
                }}
                >
                    &copy;{new Date().getFullYear()} COG. All rights reserved.
                </div>
            </div>

            <style>
                {
                    `
                    .footer-link{
                    color: rgba(255, 255, 255, 0.85);
                    text-decoration: none;
                    transition: color 0.3s ease;
                    display: block;
                    margin-bottom: 6px;
                    font-weight:bold;
                    }
                    .footer-link:hover{
                    color: #1E90FF;
                    }
                    .social-icon{
                    font-size:1.1rem;
                    color:white;
                    background: rgba(30, 144, 255, 0.2);
                    padding: 8px;
                    border-radius: 50%;
                    }
                    .social-icon:hover{
                    background: #1E90FF;
                    color: white;
                    transform: scale(1.1);
                    box-shadow: 0 0 12px rgba(30, 144, 255, 0.6);
                    }
                    @media(max-width:778px){
                    .quickLinks{
                    margin-left:40px
                    margin-top:20px
                    }
                    .sloganHeader{
                    font-size:1.1rem;
                    }
                    .slogan p{
                    font-size:0.8rem;
                    }
                    .quickLinks{
                    font-size:0.9rem;
                    }
                    .socials{
                    font-size:2px;
                    }
                    }
                    @media(min-width:992px){
                    .quickLinks{
                    margin-left:100px;
                    font-size:0.7rem;
                    margin-right:0;
                    }
                    .slogan{
                    margin-left:0;
                    }
                    .sloganHeader{
                    font-size:1.1rem;
                    }
                    .socials{
                    font-size:2rem;
                    margin-left:0;
                    }
                    .social-icon{
                    font-size:1.2rem;
                    }
                    }
                    .copy{
                    border-radius:4px;
                    }
                    `
                }
            </style>
        </footer>
        </>
    )
}
export default Footer