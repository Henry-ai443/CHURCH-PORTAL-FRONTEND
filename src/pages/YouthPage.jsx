import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import YouthMessageForm from "../components/YouthMessageForm";
import YouthHeroSection from "../components/YouthHeroSection";
import Quiz from "../components/Quiz";
const YouthPage = () => {
    return (
        <>
        <YouthHeroSection/>
        <Quiz/>
        <YouthMessageForm/>
        </>
    );
}
export default YouthPage;