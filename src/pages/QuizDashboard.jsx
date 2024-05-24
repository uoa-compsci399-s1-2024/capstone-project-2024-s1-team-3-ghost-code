import React, { useState, useEffect } from 'react';
import redaxios from 'redaxios';
import ClientDashboard from '../components/Dashboards/CDashboard'; // Assuming this sidebar is appropriate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'; // Icon for module completion
import { Link, useNavigate} from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import ClientInfo from "../components/ClientComponent/clientInfo";
import "./QuizDashboard.css";


function QuizDashboard() {
    const navigate = useNavigate();
    const clinicianToken = sessionStorage.getItem('cliniciantoken');
   

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  const [practiceQuizID, setPracticeQuizID] = useState(null);
  const [finalQuizID, setFinalQuizID] = useState(null);

  const [finalPassed, setFinalPassed] = useState(false);
  const [practisePassed, setpractisePassed] = useState(false);

  const [moduleAccessStatusList, setModuleAccessStatusList] = useState([]);
  const [currentAccessDescription, setCurrentAccessDescription] = useState("");



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await redaxios.get('https://api.tmstrainingquizzes.com/webapi/GetModules', {
                    headers: {
                        "Authorization": `Bearer ${clinicianToken}` // Include token in headers
                    }
                });
                setModules(response.data);
            } catch (error) {
              
                if (error.status) {
                    const { status } = error.status;
                    if (status === 401) {
                    
                        // Token is invalid or expired, log the user out
                        sessionStorage.removeItem('cliniciantoken');
                        navigate('/cliniciansign'); // Redirect to login page
                    } else if (status === 403) {
                        // Not authorized to access resource, redirect to appropriate dashboard
                        navigate('/quizDashboard'); // Redirect to appropriate dashboard
                    }
                } else {
                    console.error('Error fetching modules:', error);
                }
            }
        };

    fetchData();
  }, [clinicianToken, navigate]);


  useEffect(() => {
    const fetchModuleAccessStatuses = async () => {
      const moduleAccessStatusList = [];
      try {
        for (const module of modules) {
          const accessStatus = await fetchModuleAccessStatus(module.moduleID);
          moduleAccessStatusList.push(accessStatus);
        }
        setModuleAccessStatusList(moduleAccessStatusList);
      } catch (error) {
        console.error('Error fetching module access statuses:', error);
      }
    };
  
    fetchModuleAccessStatuses();
  }, [modules]);

  


  const fetchModuleAccessStatus = async (moduleID) => {
    try {
      const response = await redaxios.get(`https://api.tmstrainingquizzes.com/webapi/CheckAccess/${moduleID}`, {
        headers: {
          "Authorization": `Bearer ${clinicianToken}`
        }
      });
      return response.data;
      

    } catch (error) {
      console.error('Error fetching module access status:', error);
      return {};
    }
  };  


  const handleModuleClick = async (module) => {  
    // If the clicked module is already selected, deselect it
    if (selectedModule && selectedModule.moduleID === module.moduleID) {
      setSelectedModule(null);
      setFinalPassed(false);
      setpractisePassed(false);
      setCurrentAccessDescription(""); // Clear description when deselecting
      console.log(currentAccessDescription);
    } else {
      // Otherwise, select the clicked module
      setSelectedModule(module);
      const access = await fetchModuleAccessStatus(module.moduleID)
      setFinalPassed(access.finalPassed);
      setpractisePassed(access.practicePassed);
      setCurrentAccessDescription(access.description); // Set new description
      console.log(currentAccessDescription);
    
    }
  };


    const handlePracticeQuizClick = async (module) => {
        try {
            const response = await redaxios.get(`https://api.tmstrainingquizzes.com/webapi/GetQuizzesByModID/${module.moduleID}`, {
                headers: {
                    "Authorization": `Bearer ${clinicianToken}` // Include token in headers
                }
            });
            const practiceQuizID = response.data[0]?.quizID;
            if (practiceQuizID) {
                navigateToQuizPage(practiceQuizID);
            } else {
                console.error("Practice quiz ID not found.");
            }
        } catch (error) {
            console.error('Error fetching practice quiz ID:', error);
        }
    };

    const handleFinalQuizClick = async (module) => {
      try {
        const accessStatus = await fetchModuleAccessStatus(module.moduleID);
        if (module.sequence === 7) {
          if (accessStatus.practicePassed && accessStatus.finalPassed) {
            const response = await redaxios.get(`https://api.tmstrainingquizzes.com/webapi/GetQuizzesByModID/${module.moduleID}`, {
              headers: {
                "Authorization": `Bearer ${clinicianToken}`
              }
            });
            const finalQuizID = response.data[0]?.quizID; // Assume first quiz ID is for the recertification
            if (finalQuizID) {
              navigateToQuizPage(finalQuizID);
            } else {
              console.error("Final quiz ID not found.");
            }
          } else {
            alert(accessStatus.description);
          }
        } else {
          if (accessStatus.practicePassed && !accessStatus.finalPassed) {
            const response = await redaxios.get(`https://api.tmstrainingquizzes.com/webapi/GetQuizzesByModID/${module.moduleID}`, {
              headers: {
                "Authorization": `Bearer ${clinicianToken}`
              }
            });
            const finalQuizID = response.data[1]?.quizID;
            if (finalQuizID) {
              navigateToQuizPage(finalQuizID);
            } else {
              console.error("Final quiz ID not found.");
            }
          } else if (!accessStatus.practicePassed) {
            alert(accessStatus.description);
          } else if (accessStatus.finalPassed) {
            alert(accessStatus.description);
          }
        }
      } catch (error) {
        console.error('Error handling final quiz click:', error);
      }
    };
  
    

  const navigateToQuizPage = (quizID) => {
    // Navigate to the quiz page with the retrieved quiz ID
    navigate(`/quiz/${quizID}/${selectedModule.moduleID}`);
  };




  return (
    <div className="flex">
      <div className="dashboard-container">
        <ClientDashboard />
      </div>
      <div className="quizModuleContainer">
      <ClientInfo />
        <div className="quizModuleresults">
          {modules.map((module) => (
            <div
              key={module.moduleID}
              className="module-item"
              onClick={() => handleModuleClick(module)}
            >
              <div className="moduleId">{"Module " + module.sequence}</div>
              <div className="moduleName">{module.name}</div>
              <div className="moduleDescription">{module.description}</div>
              <FontAwesomeIcon
                icon={faCircleCheck}
                style={{
                  fontSize: "24px",
                  color: moduleAccessStatusList[module.sequence - 1]?.finalPassed === true ? "#4CAF50" : "#ccc",
                }}
              />
              {selectedModule &&
                selectedModule.moduleID === module.moduleID && (
                  <div className="module-buttons">
                    {module.sequence !== 7 && (
                      <button
                        className="module-button practice"
                        onClick={() => handlePracticeQuizClick(module)}
                      >
                        Practice Quiz
                      </button>
                    )}
                    <div className="tooltip">
                      <button
                        className={`module-button final ${(module.sequence === 7 && (!practisePassed || !finalPassed)) || (!practisePassed && module.sequence !== 7) || finalPassed ? 'disabled-button' : ''}`}
                        onClick={() => handleFinalQuizClick(module)}
                        disabled={(module.sequence === 7 && (!practisePassed || !finalPassed)) || (!practisePassed && module.sequence !== 7) || finalPassed}
                      >
                        Final Quiz
                      </button>
                      <span className="tooltiptext">{selectedModule && selectedModule.moduleID === module.moduleID ? currentAccessDescription : ''}</span>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizDashboard;