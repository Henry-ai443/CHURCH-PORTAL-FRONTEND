import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import { motion } from 'framer-motion';

const EventsSection = () => {
    const [events, setEvents] = useState([]);
    const BASE_URL = "http://10.111.3.255:8000";
    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const res  = await fetch(`${BASE_URL}/api/events/`);
                const data = await res.json();
                setEvents(data.slice(0,3));//Return the first three events...
            }catch(error){
                console.error("Error fetching events: ", error)
            }
        }
        fetchEvents();
    })

    return(
        <section className='py-5'
        style={{
            background:"linear-gradient(135deg, rgba(30, 144, 255, 0.08), rgba(0, 51, 102, 0.08))",

        }}
        >
            <div className='container text-center'>
                <h2 className='text-3xl fw-bold text-dark'>Upcoming Events</h2>

                <div className='row g-4'>
                    {events.map((event, index) => (
                        <motion.div 
                        key={event.id}
                        className='col-12 col-md-6 col-lg-4'
                        initial={{opacity: 0, y:40}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once:true}}
                        transition={{duration: 0.5, delay:index * 0.2}}
                        >
                            <div className='card h-100 shadow-lg border-0'
                            style={{
                                background:"rgba(255, 255, 255, 0.9)",
                                backdropFilter:"blur(12px)",
                            }}
                            >
                                {event.image ? (
                                    <img 
                                    src={`${BASE_URL}${event.image}`}
                                    alt={event.title}
                                    className='card-img-top'
                                    style={{
                                        height:"200px",
                                        objectFit:"cover"
                                    }}
                                    />
                                ): (
                                    <div
                                    style={{
                                        height:"200px",
                                        background:"#e0e0e0",
                                        display:"flex",
                                        alignItems:"center",
                                        justifyContent:"center",
                                        color:"#777"
                                    }}
                                    >No Image</div>
                                )}
                                <div className='card-body text-start'>
                                    <h5 className='card-title'>{event.title}</h5>
                                    <p className='card-text text-muted'>
                                        {new Date(event.date_time).toLocaleString()}
                                    </p>
                                    {event.location &&(
                                        <p className='card-text text-muted'>{event.location}</p>
                                    )}
                                    <p className='card-text'>
                                        {event.description?.length > 100 ? event.description.substring(0, 100) + "...": event.description }
                                    </p>
                                    <Link to={`/events/${event.id}`} className='text-primary fw-semibold'>See More</Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className='text-center mt-4'>
                    <a href="/events" className='btn btn-outline-primary px-4 fw-bold'
                    style={{
                        borderRadius:"20px"
                    }}
                    >See All Events</a>
                </div>
            </div>
        </section>
    )
}
export default EventsSection;