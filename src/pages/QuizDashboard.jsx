import React, { useState, useEffect } from 'react';
import axios from 'redaxios';
import ClientDashboard from '../components/Dashboards/CDashboard'; // Assuming this sidebar is appropriate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'; // Icon for module completion
import { Link, useNavigate} from "react-router-dom";
import "./QuizDashboard.css";



function QuizDashboard() {
    const navigate = useNavigate();
    const clinicianToken = sessionStorage.getItem('cliniciantoken');

    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);

    const [practiceQuizID, setPracticeQuizID] = useState(null);
    const [finalQuizID, setFinalQuizID] = useState(null);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.tmstrainingquizzes.com/webapi/GetModules', {
                    headers: {
                        "Authorization": `Bearer ${clinicianToken}` // Include token in headers
                    }
                });
                setModules(response.data);
            } catch (error) {
                if (error.response) {
                    const { status } = error.response;
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

    const handleModuleClick = async (module) => {
        // If the clicked module is already selected, deselect it
        if (selectedModule && selectedModule.moduleID === module.moduleID) {
            setSelectedModule(null);
        } else {
            // Otherwise, select the clicked module
            setSelectedModule(module);       
        }
    };

    const handlePracticeQuizClick = async (module) => {
        try {
            const response = await axios.get(`https://api.tmstrainingquizzes.com/webapi/GetQuizzesByModID/${module.moduleID}`, {
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
            const response = await axios.get(`https://api.tmstrainingquizzes.com/webapi/GetQuizzesByModID/${module.moduleID}`, {
                headers: {
                    "Authorization": `Bearer ${clinicianToken}` // Include token in headers
                }
            });
            const finalQuizID = response.data[1]?.quizID;
            console.log(finalQuizID);
            if (finalQuizID) {
                navigateToQuizPage(finalQuizID);
            } else {
                console.error("Final quiz ID not found.");
            }
        } catch (error) {
            console.error('Error fetching final quiz ID:', error);
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
                <div className="quizModuleresults">
                    {modules.map(module => (
                        <div key={module.moduleID} className="module-item" onClick={() => handleModuleClick(module)}>
                            <div className="moduleId">{"Module " + module.sequence}</div>
                            <div className="moduleName">{module.name}</div>
                            <div className="moduleDescription">{module.description}</div>
                            <FontAwesomeIcon icon={faCircleCheck} style={{ color: module.completion === 100 ? '#4CAF50' : '#ccc' }} />
                            {selectedModule && selectedModule.moduleID === module.moduleID && (
                            <div className="module-buttons">
                                <button className="module-button practice" onClick={() => handlePracticeQuizClick(module)}>Practice Quiz</button>
                                <button className="module-button final" onClick={() => handleFinalQuizClick(module)}>Final Quiz</button>
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