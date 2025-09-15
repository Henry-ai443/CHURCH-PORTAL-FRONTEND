import { section } from 'framer-motion/client';
import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";

const EventsSection = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try{
                const res  = await fetch("http://localhost:8000/api/events/");
                const data = await res.json();
                setEvents(data.slice(0,3));//Return the first three events...
            }catch(error){
                console.error("Error fetching events: ", error)
            }
        }
        fetchEvents();
    })

    return(
        <section></section>
    )
}
export default EventsSection;