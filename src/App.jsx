import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLoginComponents } from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import Presurvey from "./pages/PreSurvey";
import { ClinicianSignComponents } from "./pages/ClinicianSign";
import  AClinicianSearch from './pages/AClinicianSearch';
import   QuizDashboard  from './pages/QuizDashboard';

function App() {
  console.log("Rendering App component");
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/adminlogin" element={<AdminLoginComponents />} />
          <Route path="/presurvey" element={<Presurvey />} />
          <Route path="/cliniciansign" element={<ClinicianSignComponents />} />
          <Route path="/adminsearch" element={<AClinicianSearch />} /> 
          <Route path="/quizDashboard" element={<QuizDashboard />} /> 

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
