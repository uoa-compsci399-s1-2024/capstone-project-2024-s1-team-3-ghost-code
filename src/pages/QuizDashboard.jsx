import React, { useState, useEffect } from 'react';
import axios from 'redaxios';
import { useNavigate } from 'react-router-dom';
import ClientDashboard from "../components/Dashboards/CDashboard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCertificate } from '@fortawesome/free-solid-svg-icons';

function QuizDashboard() {
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);

    useEffect(() => {
        axios.get('https://your-api-url.com/modules')
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
            <div className="module-container">
                <div className="module-list">
                    {modules.map(module => (
                        <div key={module.id} className="module-item" onClick={() => navigate(`/module/${module.id}`)}>
                            <div className="module-title">{module.title}</div>
                            <div className="module-description">{module.description}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="progress-container">
                <button className="certify-button" onClick={() => navigate('/certification')}>
                    Get Certified!
                    <FontAwesomeIcon icon={faCertificate} />
                </button>
                <div className="module-progress">
                    {modules.map(module => (
                        <div key={module.id} className="progress-item">
                            <span className="module-id">{`Module ${module.id}`}</span>
                            <div className="progress-circle" style={{ background: `conic-gradient(green ${module.completion}%, #ccc 0)` }}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizDashboard;
