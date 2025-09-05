import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Import your components from your project folder
import Navbar from './assets/Layout/Navbar';
import Home from './assets/Components/Pages/Home';
import Contact from './assets/Components/Pages/Contact';
import About from './assets/Components/Pages/About';
import DoctorList from './assets/Components/Pages/Doctors';
import Footer from './assets/Layout/Footer';
import AdminDashboard from './assets/Components/Pages/admin';

function App() {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/DoctorList" element={<DoctorList />} />
        <Route 
          path="/admin" 
          element={
            <>
              <SignedIn>
                <AdminDashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;