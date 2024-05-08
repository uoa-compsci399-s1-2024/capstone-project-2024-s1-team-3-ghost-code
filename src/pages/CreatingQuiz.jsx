import "./CreatingQuiz.css";
import axios from "redaxios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

// const adminToken = sessionStorage.getItem("adminToken");
// const requestOptions = {
//   method: "GET",
//   headers: {
//     Authorization:
//       "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3NlcmlhbG51bWJlciI6IjQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTcxNTIxMzI2M30.YUVgtMQlfRuY2C1FWH4TmmixPEcdSOCsoRH4CSgCnYlsUOWi4_haRmHivjftGlS3GIQrFwGvKWC0cXVC5u_43g",
//   },
// };
export function QuizSearch() {}
export function Modules() {
  const navigate = useNavigate();
  const clinicianToken = sessionStorage.getItem("cliniciantoken");

  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetModules",
          {
            headers: {
              Authorization: `Bearer ${clinicianToken}`, // Include token in headers
            },
          }
        );
        setModules(response.data);
      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            // Token is invalid or expired, log the user out
            sessionStorage.removeItem("cliniciantoken");
            navigate("/cliniciansign"); // Redirect to login page
          } else if (status === 403) {
            // Not authorized to access resource, redirect to appropriate dashboard
            navigate("/quizDashboard"); // Redirect to appropriate dashboard
          }
        } else {
          console.error("Error fetching modules:", error);
        }
      }
    };

    fetchData();
  }, [clinicianToken, navigate]);

  return (
    <div className="flex">
      <div className="dashboard-container"></div>
      <div className="quizModuleContainer">
        <div className="quizModuleresults">
          {modules.map((module) => (
            <div
              key={module.moduleID}
              className="module-item"
              onClick={() =>
                navigate(
                  `http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetModuleByID/${module.sequence}`
                )
              }
            >
              <div className="moduleId">{"Module " + module.sequence}</div>
              <div className="moduleName">{module.name}</div>
              <div className="moduleDescription">{module.description}</div>
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{
                  color: module.completion === 100 ? "#4CAF50" : "#ccc",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuestionsDisplay() {
  const [questions, setQuestions] = useState([]);

  // This useEffect fetches modules initially to display, and then for each module, it fetches questions
  useEffect(() => {
    fetch(
      "http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetModules",
      requestOptions
    )
      .then((res) => res.json())
      .then((modules) => {
        console.log(modules);
        // For each module, fetch questions
        Promise.all(
          modules.map((mod) =>
            fetch(
              `http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetQuestions/${mod.sequence}`
            )
              .then((res) => res.json())
              .then((questionsForModule) => {
                // Add questions to the module object
                mod.questions = questionsForModule;
                return mod;
              })
          )
        ).then((modulesWithQuestions) => {
          console.log(modulesWithQuestions);
          setQuestions(modulesWithQuestions);
        });
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
      });
  }, []);

  // Now you have questions grouped by modules in the 'questions' state

  return (
    <>
      {questions.map((question) => (
        <div key={question.questionID} className="questionContainer">
          <div className="questioninfo">{question.description}</div>
        </div>
      ))}
    </>
  );
}

export default function QuizCreation() {
  return (
    <>
      <Modules />
      <AdminDashboard />
      {/* <QuestionsDisplay /> */}
    </>
  );
}
