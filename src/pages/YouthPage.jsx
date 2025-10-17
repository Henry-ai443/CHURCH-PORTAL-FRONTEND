import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import YouthMessageForm from "../components/YouthMessageForm";
import YouthHeroSection from "../components/YouthHeroSection";
const YouthPage = () => {
    return (
        <>
        <Navbar/>
        <YouthHeroSection/>
        <YouthMessageForm/>
        <Footer/>
        </>
    );
}
export default YouthPage;