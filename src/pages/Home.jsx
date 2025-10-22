import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Announcements from "../components/Announcements";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
import MissionVisionSection from "../components/MissionVisonSection";
const Home = () => {
    return(
        <>
        <Hero/>
        <MissionVisionSection/>
        <Announcements/>
        <EventsSection/>
        <AboutSection/>
        </>
    )
}
export default Home