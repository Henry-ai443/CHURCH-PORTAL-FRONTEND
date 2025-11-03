import React from "react";

const Hero = () => {
  return (
    <>
      <section
        className="d-flex align-items-center justify-content-center text-center"
        style={{
          height: "100vh",
          background:
            "linear-gradient(rgba(0, 51, 102, 0.5), rgba(0, 51, 102, 0.6)), url(/Hero.jpg) center/cover no-repeat",
          color: "white",
          padding: "0 20px",
        }}
      >
        <div className="hero-content">
          {/* Church Logo */}
          <img
            src="/logo.png"
            alt="church logo"
            style={{
              width: "130px",
              height: "130px",
              objectFit: "contain",
              marginBottom: "25px",
              filter: "drop-shadow(0 0 12px rgba(30, 144, 255, 1.2))",
            }}
          />

          {/* Welcome Text */}
          <h3 className="fw-light welcome-text fade-in">WELCOME TO:</h3>
          <h1 className="church-name fade-in-delay">
            GENERAL CONFERENCE CHURCH OF GOD 7TH DAY
          </h1>

          {/* Youth Hub Subtitle */}
          <h2 className="youth-hub-title mt-3 fade-in-delay">
            Youth <span style={{ color: "#00e0ff" }}>Hub</span>
          </h2>

          {/* CTA Buttons */}
          <div className="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 fade-in-up">
            <a href="https://www.youtube.com/@GccogThika" className="btn btn-primary btn-lg me-md-3 glow-btn">
              🎧 Watch Sermons
            </a>
            <a href="/events" className="btn btn-outline-light btn-lg glow-btn-outline">
              📅 Join an Event
            </a>
          </div>
        </div>

        {/* Custom CSS */}
        <style>
          {`
            .hero-content {
              max-width: 800px;
              animation: fadeIn 2s ease-in-out;
            }

            .welcome-text {
              font-size: 1.3rem;
              letter-spacing: 1.5px;
            }

            .church-name {
              font-size: 2.7rem;
              font-weight: bold;
              background: linear-gradient(90deg, #ffffff, #87CEFA, #1E90FF);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }

            .youth-hub-title {
              font-size: 1.8rem;
              font-weight: 500;
              letter-spacing: 2px;
              color: #fff;
              text-transform: uppercase;
            }

            .glow-btn {
              box-shadow: 0 0 10px rgba(30, 144, 255, 0.7), 0 0 20px rgba(135, 206, 250, 0.7);
              transition: all 0.3s ease-in-out;
            }

            .glow-btn:hover {
              box-shadow: 0 0 20px rgba(30, 144, 255, 0.9), 0 0 40px rgba(135, 206, 250, 0.8);
              transform: translateY(-2px);
            }

            .glow-btn-outline {
              box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
              transition: all 0.3s ease-in-out;
            }

            .glow-btn-outline:hover {
              box-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(30, 144, 255, 0.7);
              transform: translateY(-2px);
              background-color: rgba(255, 255, 255, 0.1);
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .fade-in {
              animation: fadeIn 1.5s ease-out forwards;
            }

            .fade-in-delay {
              animation: fadeIn 2s ease-out forwards;
            }

            .fade-in-up {
              animation: fadeIn 2.5s ease-out forwards;
            }

            @media (max-width: 768px) {
              .church-name {
                font-size: 2rem;
              }

              .youth-hub-title {
                font-size: 1.4rem;
              }
            }
          `}
        </style>
      </section>
    </>
  );
};

export default Hero;
