import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appointment from "./pages/Appointment/Appointment";
import Certificates from "./pages/Certificates/Certificates";
import Education from "./pages/Education/Education";
import Events from "./pages/Events/Events";
import Home from "./pages/Home/Home";
import Navbar from "./components/NavBar/NavBar";
import Research from "./pages/Research/Research";
import Awards from "./pages/Awards/Awards";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/certificates-membership" element={<Certificates />} />
        <Route path="/education-experience" element={<Education />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/research-publications" element={<Research />} />
        <Route path="/events" element={<Events />} />
        <Route path="/appointment" element={<Appointment />} />
      </Routes>
    </Router>
  )
}

export default App;
