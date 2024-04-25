import React, { useState, useEffect } from 'react';
import axios from 'redaxios';
import AdminDashboard from '../components/Dashboards/ADashboard'; // Assuming this sidebar is appropriate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'; // Icon for module completion

function QuizDashboard() {
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
                <AdminDashboard />
            </div>
            <div className="search-container" style={{ flex: 3 }}> {/* Adjusted for module display */}
                <div className="search-results" style={{ paddingTop: '20px' }}>
                    {modules.map(module => (
                        <div key={module.id} className="result-item" onClick={() => navigate(`/module/${module.id}`)}>
                            <div className="result-name">{module.title}</div>
                            <div className="result-email">{module.description}</div>
                            <FontAwesomeIcon icon={faCircleCheck} style={{ color: module.completion === 100 ? '#4CAF50' : '#ccc' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizDashboard;
