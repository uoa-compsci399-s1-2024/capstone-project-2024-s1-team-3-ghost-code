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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetModules', {
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

    return (
        <div className="flex">
            <div className="dashboard-container">
                <ClientDashboard />
            </div>
            <div className="quizModuleContainer">
                <div className="quizModuleresults">
                    {modules.map(module => (
                        <div key={module.moduleID} className="module-item" onClick={() => navigate(`http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetModuleByID/${module.sequence}`)}>
                            <div className="moduleId">{"Module " + module.sequence}</div>
                            <div className="moduleName">{module.name}</div>
                            <div className="moduleDescription">{module.description}</div>
                            <FontAwesomeIcon icon={faCircleCheck} style={{ color: module.completion === 100 ? '#4CAF50' : '#ccc' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizDashboard;