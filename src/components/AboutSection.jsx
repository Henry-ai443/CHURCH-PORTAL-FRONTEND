import React from "react";

const AboutSection = () => {
  return (
    <section className="about-section py-5">
      <div className="container">
        <div className="row align-items-center flex-column-reverse flex-md-row">
          {/* TEXT CONTENT */}
          <div className="col-md-6 text-center text-md-start mt-4 mt-md-0">
            <h2 className="fw-bold text-primary mb-3">About General Conference Youth Hub</h2>
            <p>
              At <strong>General Conference</strong>, we empower young people to grow in faith, leadership, and purpose. Our goal is to provide a safe, creative, and spiritual space for youths to express themselves, connect with others, and serve God through their unique talents.
            </p>
            <small>Welcome All</small>
          </div>

          {/* VIDEO & IMAGE */}
          <div className="col-md-6 position-relative text-center">
            {/* DESKTOP VIDEO */}
            <div className="d-none d-md-block">
              <video
                className="rounded-4 shadow w-100"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="https://videos.pexels.com/video-files/3182832/3182382-uhd_2560_1440_30fps.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* MOBILE IMAGE */}
            <div className="d-md-none">
              <img
                src="https://source.unsplash.com/800x600/?youth,church"
                alt="Youth Ministry"
                className="img-fluid rounded-4 shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
