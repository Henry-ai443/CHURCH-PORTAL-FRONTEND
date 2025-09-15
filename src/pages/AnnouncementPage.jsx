import React from "react";
import AllAnnouncements from "../components/AllAnnouncements";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const AnnouncementPage = () => {
return(
    <>
        <Navbar/>
        <main>
        <AllAnnouncements/>
        </main>
        <Footer/>
    </>
)
}
export default AnnouncementPage
