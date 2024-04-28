import React, { useState, useEffect } from 'react';
import axios from 'redaxios';
import ClientDashboard from '../components/Dashboards/CDashboard'; // Assuming this sidebar is appropriate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'; // Icon for module completion
import "./QuizDashboard.css";

function QuizDashboard() {
    const [modules, setModules] = useState([]);

    useEffect(() => {
        axios.get('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetModules')
            .then(response => {
                setModules(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch modules:', error);
            });
    }, []);

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