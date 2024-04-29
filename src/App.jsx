import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLoginComponents } from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import Presurvey from "./pages/PreSurvey";
import { ClinicianSignComponents } from "./pages/ClinicianSign";
import AClinicianSearch from "./pages/AClinicianSearch";
import QuizDashboard from "./pages/QuizDashboard";
import CreatingQuiz from "./pages/CreatingQuiz";
import AdminSetting from "./pages/AdminSettings";

// function setToken(userToken) {
//   sessionStorage.setItem("token", JSON.stringify(userToken));
// }

// function getToken() {
//   const tokenString = sessionStorage.getItem("token");
//   const userToken = JSON.parse(tokenString);
//   return userToken?.token;
// }

function App() {
  // const token = getToken();

  // if (!token) {
  //   return <AdminLoginComponents setToken={setToken} />;
  // }
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
          <Route path="/creatingquiz" element={<CreatingQuiz />} />
          <Route path="/adminSettings" element={<AdminSetting />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
