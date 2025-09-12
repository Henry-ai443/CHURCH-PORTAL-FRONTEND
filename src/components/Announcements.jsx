import React, {useEffect, useState} from "react";

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try{
                const res = await fetch('http://127.0.0.1:8000/api/announcemments/');
                const data = await res.json();
                setAnnouncements(data);
            }catch(error){
                console.error("Error fetching announcements: ", error)
            }
        };
        fetchAnnouncements();
    }, []);

    return(
        <section className="container my-5">
            <h2 className="text-center mb-4 fw-bold text-primary">Latest Announcements</h2>
        </section>
    )
}
export default Announcements