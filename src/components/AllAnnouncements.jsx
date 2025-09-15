import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";

const AllAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try{
                const response = await fetch("http://localhost:8000/api/announcements/all/");
                const data = await response.json();
                setAnnouncements(data);
            }catch(error){
                console.error("Error fetching announcements: ", error);
            }
        };
        fetchAnnouncements();
    })
    return(

<div className="container my-5">
            <h2 className="text-center fw-bold mb-4 "
            >ALL Announcements</h2>
            <div className="row">
                {announcements.length > 0 ? (announcements.map((item, index) => (
                    <motion.div 
                    key={index}
                    className="col-md-4 mb-4"
                    initial = {{
                        opacity: 0, y: 40
                    }}
                    whileInView={
                        {
                            opacity: 1, y: 0
                        }
                    }
                    viewport={{once:true}}
                    transition={{duration:0.6, delay:index * 0.2}}
                    >
                        <div className="card h-100 shadow-lg border-1"
                        style={{
                            background:"rgba(0, 51, 102, 0.35)",
                            backgroundFilter:"blur(10px)",
                            borderRadius:"15px",
                            color:"white",
                        }}>
                            <div className="card-body">
                                <h5 className="card-title fw-bold" >{item.title}</h5>
                                <p className="card-text">{item.message}</p>
                            </div>
                            <div className="card-footer text-muted small">
                                {new Date(item.time).toLocaleString()}
                            </div>
                        </div>
                    </motion.div>
                ))): (<p className="text-center">No announcements available</p>)}
            </div>
            <style>
                {`
                .announcements-page{
                min-height:50vh !important;
                background: linear-gradient(135deg,
                rgba(0, 51, 102, 0.9),
                rgba(30, 144, 255, 0.7),
                rgba(135, 206, 250, 0.4)
                )
                }
                `}
            </style>
        </div>
    )
}
export default AllAnnouncements