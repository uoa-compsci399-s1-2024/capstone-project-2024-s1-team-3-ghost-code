import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLogin } from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import {AdminClinicianSearch} from "./pages/AClinicianSearch"

function App() {
  console.log("Rendering App component");
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/home" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
