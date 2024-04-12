import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLoginComponents } from "./pages/AdminLogin";
import Landing from "./pages/Landing";

function App() {
  console.log("Rendering App component");
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/adminlogin" element={<AdminLoginComponents />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
