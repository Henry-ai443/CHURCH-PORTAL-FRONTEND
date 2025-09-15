import React from "react";

const Hero = () => {
return(<>
<section className="d-flex align-items-center justify-content-center text-center"
style={{
    height:"100vh",
    background:"linear-gradient(rgba(0, 51, 102, 0.25), rgba(0, 51, 102, 0.35)), url(/Hero.jpg) center/cover no-repeat",
    color:"white",
    padding:"0 20px",
}}
>
    <div>
        {/**CHURCH LOGO */}
        <img src="/logo.png" alt="church logo" 
        style={{
            width: "120px",
            height:"120px",
            objectFit:"contain",
            marginBottom:"20px",
            filter:"drop-shadow(0 0 10px rgba(30, 144, 255, 2))"
        }}
        />

        {/**WELCOME TEXT */}
        <h3 style={{
            fontWeight:"300",
            letterSpacing:"2px"
        }}>WELCOME TO:</h3>
        <h1 style={{
            fontSize:"3rem",
            fontWeight:"bold",
            background:"linear-gradient(90deg, #ffffff, #87CEFA, #1E90FF",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            marginBottom:"20px",

        }}>GENERAL CONFERENCE CHURCH OF GOD 7TH DAY</h1>

        {/**CTA BUTTONS */}
        <div className="mt-4 d-flex flex-column fles-md-row justify-content-center align-items-center gap-3 fade-in-up">
            <a href="/sermons" className="btn btn-primary btn-lg me-3 glow-btn">Watch Sermons</a>
            <a href="/events" className="btn btn-outline-light btn-lg me-3 glow-btn-outline">Join an Event</a>
        </div>
    </div>

    <style>
        {
            `
            .glow-btn{
            box-shadow:0 0 10px rgba(30, 144, 255, 0.7), 0 0 20px rgba(135, 206, 250, 0.7);
            transition: all 0.3s ease-in-out;
            }
            .glow-btn:hover{
            box-shadow: 0 0 20px rgba(30, 144, 255,0.9), 0 0 40px rgba(135, 206, 250, 0.8);
            transform:translateY(-2px);
            }
            .glow-btn-outline{
            box-shadow:0 0 8px rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease-in-out;
            }
            .glow-btn-outline:hover{
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(30, 144, 255, 0.7);
            transform: translateY(-2px);
            background-color:rgba(255, 255, 255, 0.1)
            }
            `
        }
    </style>
</section>
</>)
}
export default Hero;