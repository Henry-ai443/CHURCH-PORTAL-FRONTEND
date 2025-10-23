import React, { useEffect } from "react";

const QuickStats = () => {
    const [stats, setStats] = useState({
        events: 0,
        youth:0,
        announcements: 0,
    })

    useEffect(() => {
        const fetchStats = async () => {

            {/**EVENTS */}
            const resEvents = await fetch("https://church-portal-backend.onrender.com/api/events");
            const eventData = await resEvents.json();

            {/**REGISTERED MEMBERS */}
            

            {/* ANNOUNCEMENTS */}
            const resAnnouncements = await fetch("https://church-portal-backend.onrender.com/api/announcements/all/");
            const announcementsData = await resAnnouncements.json();

            setStats({
                events: eventData.length,
                announcements: announcementsData.length
            })

        }

        fetchStats();
    }, []);

    return(
        <div className="row g-3 mb-4">
            {/**EVENTS */}
            <div className="col-sm-6 col-lg-3">
                <div className="card text-white bg-primary h-100 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">
                            Events
                        </h5>
                        <h2 className="fw-bold">{stats.events}</h2>
                        <small>Total Events Created</small>
                    </div>
                </div>
            </div>

            {/**Announcements */}
            <div className="col-sm-6 col-lg-3">
                <div className="card text-white bg-primary h-100 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">
                            Announcements
                        </h5>
                        <h2 className="fw-bold">{stats.announcements}</h2>
                        <small>Total Announcements Created</small>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
export default QuickStats