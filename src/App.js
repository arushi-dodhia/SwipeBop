import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landingpage";
import Swiping from "./components/Swiping"
import Login  from "./components/Login"
import Contact from "./components/Contact"
import About from "./components/About"
import Cart from "./components/Cart"
import Signup from "./components/Signup"
import Account from "./components/Account"
import Logout from "./components/Logout"

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/swipe" element={<Swiping />} />
      <Route path="/outfits" element={<Cart />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/account" element={<Account />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  </Router>
  );
}

export default App;
