import { motion } from 'framer-motion';
import { Heart, Compass } from 'lucide-react';

const MissionVisionSection = () => {
    return (
        <section style={{ backgroundColor: '#f8f9fa', padding: '4rem 0' }}>
            <div className="container">
                <div className="row align-items-center gy-5">
                    {/* IMAGE SECTION */}
                    <motion.div
                        className="col-12 col-lg-6"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
                            alt="Youth community"
                            className="img-fluid rounded shadow"
                            style={{ height: '350px', objectFit: 'cover', width: '100%' }}
                        />
                    </motion.div>

                    {/* TEXT SECTION */}
                    <motion.div
                        className="col-12 col-lg-6 text-secondary"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="h3 fw-bold text-dark mb-4">
                            Our Mission & Vision
                        </h2>
                        <p className="fs-5 mb-4">
                            We are a vibrant community of young believers driven by passion, purpose and unity.
                            Our goal is to empower youth to live boldly for Christ, serve others and create a lasting impact in their generation.
                        </p>

                        <div className="d-flex flex-column gap-4">
                            {/* Mission */}
                            <div className="d-flex gap-3">
                                <Heart color="red" />
                                <div>
                                    <h3 className="h5 fw-semibold text-dark">Our Mission</h3>
                                    <p>
                                        To Inspire and equip young people to discover their identity in Christ and actively engage in transforming their world.
                                    </p>
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="d-flex gap-3">
                                <Compass color="red" />
                                <div>
                                    <h3 className="h5 fw-semibold text-dark">Our Vision</h3>
                                    <p>
                                        To build a dynamic generation of youth who lead with faith, love and integrity - impacting their schools, families and communities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default MissionVisionSection;
