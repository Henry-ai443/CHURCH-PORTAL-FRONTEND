import React, {useEffect} from "react";
import Aos from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home"
function App() {

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true
    });
  }, [])

  return (
    <>
    <Home/>
    </>
  )
}

export default App
