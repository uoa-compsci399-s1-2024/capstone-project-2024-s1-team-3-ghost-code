import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLoginComponents } from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import Presurvey from "./pages/PreSurvey";
import { ClinicianSignComponents } from "./pages/ClinicianSign";
import AClinicianSearch from "./pages/AClinicianSearch";
import QuizDashboard from "./pages/QuizDashboard";
import AClinicianProfile from "./pages/AClinicianProfile";
import PracQuiz from "./pages/PracQuiz";
import QuizCreation from "./pages/CreatingQuiz";
import CreatingQuiz from "./pages/CreatingQuestions";
import EditQuiz from "./pages/AEditQuiz";
import AdminStatsReview from "./pages/AStatsPage";
import AdminSetting from "./pages/AdminSettings";

const getAdminToken = () => sessionStorage.getItem("adminToken");

// ProtectedRoute component to protect admin-only routes
const ProtectedRoute = ({ element, ...props }) => {
  // Check if token exists
  const adminToken = getAdminToken();
  if (!adminToken) {
    // Redirect to admin login page if token is not present
    return <Navigate to="/adminlogin" />;
  }
  // Render the provided element if token exists
  return React.cloneElement(element, props);
};

const getClinicianToken = () => sessionStorage.getItem("cliniciantoken");

const ClinicianProtectedRoute = ({ element, ...props }) => {
  const cliniciantoken = getClinicianToken();
  if (!cliniciantoken) {
    return <Navigate to="/cliniciansign" />;
  }
  return React.cloneElement(element, props);
};
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

          <Route
            path="/quizDashboard"
            element={<ClinicianProtectedRoute element={<QuizDashboard />} />}
          />

          <Route
            path="/quiz/:quizID/:moduleID"
            element={<ClinicianProtectedRoute element={<PracQuiz />} />}
          />

          <Route
            path="/adminsearch"
            element={<ProtectedRoute element={<AClinicianSearch />} />}
          />

          <Route
            path="/clinician/:clinicianId"
            element={<ProtectedRoute element={<AClinicianProfile />} />}
          />

          <Route
            path="/createquiz/:moduleID"
            element={<ProtectedRoute element={<QuizCreation />} />}
          />

          <Route
            path="/EditQuiz"
            element={<ProtectedRoute element={<EditQuiz />} />}
          />

          <Route
            path="/createquestion/:moduleID"
            element={<ProtectedRoute element={<CreatingQuiz mode="add" />} />}
          />

          <Route
            path="/createquestion/:moduleID/:questionID"
            element={<ProtectedRoute element={<CreatingQuiz mode="edit" />} />}
          />

          <Route path="/adminstats" element={<AdminStatsReview />} />

          <Route
            path="/adminSettings"
            element={<ProtectedRoute element={<AdminSetting />} />}
          />





        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
