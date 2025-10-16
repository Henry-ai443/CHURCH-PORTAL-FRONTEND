import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Announcements from "../components/Announcements";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
const Home = () => {
    return(
        <>
        <Navbar/>
        <Hero/>
        <Announcements/>
        <EventsSection/>
        <AboutSection/>
        <Footer/>
        </>
    )
}
export default Home