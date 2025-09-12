import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Announcements from "../components/Announcements";
const Home = () => {
    return(
        <>
        <Navbar/>
        <Hero/>
        <Announcements/>
        <Footer/>
        </>
    )
}
export default Home