import React, {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home"
import AnnouncementPage from "./pages/AnnouncementPage";
import EventsPage from "./pages/EventsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
function App() {

  useEffect(() => {
    Aos.init({
      duration: 2000,
      once: true
    });
  }, [])

  return (
    <>
    <Router>
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/announcements" element={<AnnouncementPage/>}/>
        <Route path="/events" element={<EventsPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/" element={<LoginPage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
