import React, { useState, useEffect } from "react";
import "./AStatsPage.css";
import redaxios from "redaxios";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminDashboard from "../components/Dashboards/ADashboard";

function AdminStatsReview() {
  const navigate = useNavigate();
  const adminToken = sessionStorage.getItem('adminToken');

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState([]);
  const [averageAttempts, setAverageAttempts] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await redaxios.get('https://api.tmstrainingquizzes.com/webapi/GetModules', {
          headers: {
            "Authorization": `Bearer ${adminToken}` // Include token in headers
          }
        });
        const modulesData = response.data;
        setModules(response.data);
        if (modulesData.length > 0) {
            setSelectedModule(modulesData[0]); // Set the first module as the selected module
          }

      } catch (error) {
        if (error.response) {
          const { status } = error.response;
          if (status === 401) {
            // Token is invalid or expired, log the user out
            sessionStorage.removeItem('adminToken');
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
  }, [adminToken, navigate]);

 


  useEffect(() => {
    const fetchQuestionsAndStats = async () => {
      if (selectedModule) {
        try {
          const questionsResponse = await redaxios.get(`https://api.tmstrainingquizzes.com/webapi/GetQuestions/${selectedModule.moduleID}`, {
            headers: {
              "Authorization": `Bearer ${adminToken}` // Include token in headers
            }
          });
          setQuestions(questionsResponse.data);

          const statsResponse = await redaxios.post(`https://api.tmstrainingquizzes.com/webapi/GetStats`, {
            searchStart: "2000-01-01T00:00:00.000Z",
            searchEnd: new Date().toISOString(),
            quizID: selectedModule.moduleID * 2,
            userID: null,
            complete: null
          }, {
            headers: {
              "Authorization": `Bearer ${adminToken}`
            }
          });

          

          setStats(statsResponse.data);
          

          const totalAttempts = statsResponse.data.length;  // Corrected to count the number of attempts
          const numberOfUsers = new Set(statsResponse.data.map(attempt => attempt.user.userID)).size;
          const average = totalAttempts / numberOfUsers;
          
          setAverageAttempts(numberOfUsers > 0 ? average : 'Module not attempted.');

        } catch (error) {
          console.error('Failed to fetch questions or stats:', error);
        }
      }
    };

    fetchQuestionsAndStats();
  }, [selectedModule, adminToken]);

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.correctRate - b.correctRate;
    } else {
      return b.correctRate - a.correctRate;
    }
  });


  console.log(questions)

  return (
    <div className="flex">
      <div className="dashboard-container">
        <AdminDashboard />
      </div>
      <div className="amr-container">
        <div className="amr-results">
          <div className="side-by-side">
            <h3>Module:</h3>
            <div className="dropdown">
              <span className="amr-span">Select Module</span>
              <div className="dropdown-content">
                {modules.map((module) => (
                  <p key={module.moduleID} onClick={() => handleModuleSelect(module)}>
                    {module.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
          {selectedModule && (
            <div className="cont-overview-module">
              <h2>{selectedModule.name}</h2>
              <p>{selectedModule.description}</p>
          
              {/* Example of how you might want to display some aggregated stats */}
              <div>
                Average attempts taken to pass: {averageAttempts !== null ? averageAttempts : 'Module not attempted.'}
              </div>
            </div>
          )}
          <div className="flags">
            <div className="side-by-side">
              <h3>Flags:</h3>
              <div className="dropdown">
                <span className="amr-span">Sort by:</span>
                <div className="dropdown-content">
                  <p onClick={() => handleSortChange('asc')}>Ascending</p>
                  <p onClick={() => handleSortChange('desc')}>Descending</p>
                </div>
              </div>
            </div>
            <div className="cont-overview-qs">
              {sortedQuestions.map((question) => (
                <div className="cont-overview-sep-qs" key={question.questionID}>
                  <h4>{question.title}</h4>
                  Accuracy: {question.correctRate}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStatsReview;