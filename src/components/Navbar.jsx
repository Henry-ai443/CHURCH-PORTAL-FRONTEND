import React, {useState} from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaBullhorn, FaCalendarAlt, FaUserPlus, FaHandHoldingHeart, FaSignInAlt, FaCalendar } from 'react-icons/fa';
import { GiHolyGrail } from 'react-icons/gi';

const Navbar = () =>{
    const [isOpen, setIsOpen] = useState(false);


    return(
        <>
        <nav className='navbar navbar-expand-lg  px-3 fixed-top'
        style={{
            background:"rgba(0, 51, 102, 0.8)",
            backdropFilter:"blur(14px)",
            WebkitBackdropFilter:"blur(14px)",
            borderBottom:"1px solid rgba(255, 255, 255, 0.2)",
        }}
        >
            <div className='container-fluid d-flex justify-content-between align-items-center'  style={{position:"relative", display:"inline"}}>
                {/**Gradient shimmer text */}
                <a
                className='navbar-brand d-flex align-items-center'
                style={{textDecoration:"none"}}
                >
                    <img src="/logo.png" alt="Church Logo" 
                    className='logo'
                    style={{
                        height:"40px",
                        width:"auto",
                        marginRight:"8px",
                        filter:"drop-shadow(0 0 6px rgba(30, 144, 255, 0.8)) drop-shadow(0 0 12px rgba(135, 206, 250, 0.6))",
                        transition:"filter 0.3s ease-in-out"
                    }}
                    />

                    <span className='fw-bold brand-text'
                    style={{
                        fontSize:"0.9rem",
                        background:"linear-gradient(90deg, #1E90FF, #87CEFA, #ffffff, #1E90FF)",
                        backgroundSize:"300%, 300%",
                        WebkitBackgroundClip:"text",
                        WebkitTextFillColor:"transparent",
                        animation:"shimmer 20s ease-in-out infinite",
                        textShadow:"0 0 10px rgba(30 ,144, 255, 0.8), 0 0 20px rgba(135, 206, 250, 0.6)",
                        whiteSpace:"nowrap"
                    }}
                    >Church of God 7th Day</span>
                </a>

                {/**LARGE SCREEN LINKS */}

                <ul className='navbar-nav d-none d-lg-flex flex-row gap-4'>
                    <li className='nav-item'>
                        <a href="/" className='nav-link text-white fw-bold fs-5'><AiFillHome size={18} className='me-2 fw-bold'/>Home</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/announcements" className='nav-link text-white fw-bold fs-5'><FaBullhorn size={18} className='me-2'/>Announcements</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/events" className='nav-link text-white fw-bold fs-5'><FaCalendarAlt size={18} className='me-2'/>Events</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/" className='nav-link text-white fw-bold fs-5'><GiHolyGrail size={18} className='me-2'/>Sermons</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/" className='nav-link text-white fw-bold fs-5'><FaHandHoldingHeart size={18} className='me-2'/>Donations</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/" className='nav-link text-white fw-bold fs-5'><FaSignInAlt size={18} className='me-2'/>Login</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/register" className='nav-link text-white fw-bold fs-5'><FaUserPlus size={18} className='me-2'/>Register</a>
                    </li>
                </ul>
                <div className='d-lg-none' onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width:"30px",
                        height:"22px",
                        cursor:"pointer",
                        position:"relative",
                        zIndex:"1100"
                    }}>
                        <span style={{
                            position:"absolute",
                            height:"3px",
                            width:"100%",
                            background:"white",
                            borderRadius:"2px",
                            transition:"0.4s",
                            transform: isOpen ? "rotate(45deg)translate(5px, 5px)":"none"
                        }}></span>
                        <span 
                        style={{
                            position:"absolute",
                            top:"9px",
                            height:"3px",
                            width:"100%",
                            background:"white",
                            borderRadius:"2px",
                            opacity:isOpen ? 0 : 1,
                            transition:'0.4s',
                        }}
                        ></span>
                        <span
                        style={{
                            position:"absolute",
                            top:"18px",
                            height:"3px",
                            width:"100%",
                            background:"white",
                            borderRadius:"2px",
                            transition:"0.4s",
                            transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none"
                        }}
                        ></span>
                    </div>
            </div>
        </nav>

        <div
        style={{
            position:"fixed",
            top:"0",
            left: isOpen ? 0 : "-250px",
            height:"100%",
            width:"250px",
            backgroundColor:"rgba(0, 51, 102, 0.7)",
            transition:"left 0.5s ease-in-out",
            padding:"60px 20px",
            zIndex:"1000",
            borderRight:"2px solid rgba(255, 255, 0.2)",
            overflowY:"auto"
        }}>
            <ul className='navbar-nav text-center fw-bold fs-5'>
                <li className='nav-item'>
                    <a href="/home" className='nav-link text-white'><AiFillHome size={18} className='me-2 fw-bold'/>Home</a>
                    <hr style={{
                        color:"white",
                        fontWeight:"bold"
                    }}/>
                </li>
                <li className='nav-item'>
                    <a href="/announcements" className='nav-link text-white'><FaBullhorn size={18} className='me-2'/>Announcements</a>
                    <hr style={{
                        color:"white",
                        fontWeight:"bold"
                    }}/>
                </li>
                <li className='nav-item'>
                    <a href="/events" className='nav-link text-white'><FaCalendarAlt size={18} className='me-2'/>Events</a>
                    <hr style={{
                        color:"white",
                        fontWeight:"bold"
                    }}/>
                    
                </li>

                <li className='nav-item'>
                    <a href="/" className='nav-link text-white'><GiHolyGrail size={18} className='me-2'/>Sermons</a>
                    <hr  style={{
                        color:"white",
                        fontWeight:"bold",
                    }}/>
                </li>
                <li className='nav-item'>
                    <a href="/" className='nav-link text-white'><FaHandHoldingHeart size={18} className='me-2'/>Donations</a>
                    <hr  style={{
                        color:"white",
                        fontWeight:"bold",
                    }}/>
                </li>
                <li className='nav-item'>
                    <a href="/" className='nav-link text-white'><FaSignInAlt size={18} className='me-2'/>Login</a>
                    <hr style={{
                        color:"white",
                        fontWeight:"bold"
                    }}/>
                </li>
                <li className='nav-item'>
                    <a href="/register" className='nav-link text-white'><FaUserPlus size={18} className='me-2'/>Register</a>
                    <hr style={{
                        color:"white",
                        fontWeight:"bold"
                    }}/>
                </li>

            </ul>
        </div>
        <style>
            {
                `
                .nav-link{
                transition:color 0.3s ease;
                }
                .nav-link:hover{
                color: #1E90FF !important
                }
                @keyframes shimmer {
                    0% {background-position: 0% 50%;}
                    50% {background-position: 100% 50%;}
                    100% {background-position: 0% 50%;}
                }
                @media(max-width: 768px){
                .navbar-brand{
                font-size:0.5rem !important;
                }
                .nav-link{
                font-size:0.7rem !important;
                }
                .logo{
                height: 40px;
                }
                }
                @media(min-width:992px){
                .navbar-brand.logo{
                height:48px !important;
                width:43px !important;
                }
                .brand-text{
                font-size:1.4rem !important;
                font-style:italic !important;
                }
                .nav-link{
                font-size:27rem;
                }
                .logo{
                height: 50px !important;
                }
                }

                @media(max-width: 576px){
                .logo{
                height: 28px;
                }
                .brand-text{
                font-size:1rem;
                }
                }
                @media(max-width: 400px){
                .logo{
                height: 22px;
                }
                .brand-text{
                font-size:0.9rem;
                }
                .logo{

                }
                `
            }
        </style>
        </>
    )
}
export default Navbar