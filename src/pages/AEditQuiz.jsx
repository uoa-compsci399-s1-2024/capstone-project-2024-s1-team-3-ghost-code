import React, { useState, useEffect } from "react";
import redaxios from "redaxios";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { Link, useNavigate } from "react-router-dom";
import "./AEditQuiz.css";
import AdminInfo from "../components/AdminComponent/adminInfo";

function EditQuiz() {
  const navigate = useNavigate();
  const adminToken = sessionStorage.getItem("adminToken");

  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await redaxios.get(
          "https://api.tmstrainingquizzes.com/webapi/GetModules",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
        setModules(response.data);
      } catch (error) {
        if (error.status) {
          const { status } = error.status;
          if (status === 401) {
            sessionStorage.removeItem("adminToken");
            navigate("/adminlogin");
          } else if (status === 403) {
            navigate("/quizDashboard");
          }
        } else {
          console.error("Error fetching modules:", error);
        }
      }
    };

    fetchData();
  }, [adminToken, navigate]);

  return (
    <div className="flex">
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <div className="quizModuleContainer">
      <AdminInfo />
        <div className="quizModuleresults">
          {modules.map((module) => (
            <Link
              key={module.moduleID}
              to={`/createquiz/${module.moduleID}`}
              className="module-link"
            >
                <div className="moduleId">{"Module " + module.sequence}</div>
                <div className="moduleName">{module.name}</div>
                <div className="moduleDescription">{module.description}</div>

            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditQuiz;
