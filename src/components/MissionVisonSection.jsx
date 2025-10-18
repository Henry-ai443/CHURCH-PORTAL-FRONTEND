import {motion} from 'framer-motion';
import { Heart, Compass } from 'lucide-react';

const MissionVisionSection = () => {
    return(
        <section className='bg-gray-50 py-16'>
            <div className='container mx-auto px-6 lg:px12 flex flex-col lg:flex-row items-center dap-12'>
                {/**IMAGE SECTION */}
                <motion.div className='w-full lg:w-1/2'
                initial={{opacity: 0, x: -40}}
                whileInView={{opacity: 1, x: 0}}
                transition={{duration: 0.8}}
                >
                    <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" alt="Youth community" className='rounded-2xl shadow-lg w-full object-cover h-[350px]'/>
                </motion.div>

                {/**TEXT SECTION */}
                <motion.div
                initial={{opacity: 0, x: -40}}
                whileInView={{opacity: 1, x: 0}}
                transition={{duration: 0.8}}
                className='w-full lg-w-1/2 space-y-6 text-gray-700'
                >
                    <h2 className='text-3xl font-bold text-gray-900'>
                        Our Mission & Vision
                    </h2>
                    <p className='text-lg leading-relaxed'>
                        We are a vibrant community of young believers driven by passion, purpose and unity.
                        Our goal is to empower youth to live boldly for Christ, serve others and create a lasting impact in their generation.
                    </p>
                    <div className='space-y-4'>
                        {/**MIssion */}
                        <div className='flex items-start gap-3'>
                            <Heart className='tex-red-500'/>
                            <div>
                                <h3 className='text-xl font-semibold text-gray-900'>
                                    Our Mision
                                </h3>
                                <p>
                                    To Inspire and equip young people to discover their identity in Christ and actively engage in transforming their world.
                                </p>
                            </div>
                        </div>

                        {/**Vision */}
                        <div className='flex items-start gap-3'>
                            <Compass className='tex-red-500'/>
                            <div>
                                <h3 className='text-xl font-semibold text-gray-900'>
                                    Our Vision
                                </h3>
                                <p>
                                    To build a dynamic generation of youth who lead with faith, love and integrity - impacting their schools, families and communities.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
export default MissionVisionSection