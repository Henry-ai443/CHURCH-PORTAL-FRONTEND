
import React from "react";

const YouthHeroSection  = () => {
    return(
        <>
        <section 
        className="youth-hero position-relative d-flex align-items-center justify-content-center text-center text-light"
        style={{
            height:"100vh",
            overflow:"hidden"
        }}
        >
            <video className="position-absolute w-100 h-100 object-fit-cover d-none d-md-block"
            autoPlay
            muted
            loop
            playsInline
            >
                <source
                
                src="https://videos.pexels.com/video-files/857195.857195-hd_1920_1080_25fps.mp4"
                type="video/mp4"
                ></source>
            </video>

            <div className="position-absolute top-0 start-0 w-100 h-100 d-md-none"
            style={{
                backgroundImage:"url('https://images.unsplash.com/photo-1740761026468-f0481e8431b0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387')",
                backgroundSize:"cover",
                backgroundPosition:"center"
            }}
            ></div>

            {/**GRADIENT OVERLAY */}
            <div className="position-absolute top-0 start-0 w-100 h-100"
            style={{
                background:"linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))",
            }}
            ></div>

            <div className="container position-relative z-3">
                <h1 className="display-4 fw-bold mb-3 text-uppercase">
                    Empower. Connect. Inspire
                </h1>
                <p className="lead mb-4">
                    Join the next generation of world changers - where faith meets passion and creativity leads to purpose
                </p>
            </div>
            {/**Animated floating sapes */}
            <div className="floating-shapes position-absolute w-100 h-100 overflow-hidden">
                <div className="shape shape1"></div>
                <div className="shape shape2"></div>
                <div className="shape shape3"></div>
            </div>
        </section>
        </>
    );
};
export default YouthHeroSection