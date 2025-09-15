import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Announcements from "../components/Announcements";
import EventsSection from "../components/EventsSection";
const Home = () => {
    return(
        <>
        <Navbar/>
        <Hero/>
        <Announcements/>
        <EventsSection/>
        <Footer/>
        </>
    )
}
export default Home