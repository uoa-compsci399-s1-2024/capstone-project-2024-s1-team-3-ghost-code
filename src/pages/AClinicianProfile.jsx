import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminDashboard from "../components/Dashboards/ADashboard";
import './AClinicianProfile.css';

function AClinicianProfile() {
    const { clinicianId } = useParams();
    const [clinicianDetails, setClinicianDetails] = useState(null);
    const [email, setEmail] = useState("");
    const [clinic, setClinic] = useState("");
    const [position, setPosition] = useState("");
    const [status, setStatus] = useState("");
    const adminToken = sessionStorage.getItem('adminToken');

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${adminToken}` // Include token in headers
            }
        };

        fetch(`http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/ClinicianSearch/${clinicianId}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse response as JSON
        })
        .then(data => {
            setClinicianDetails(data); // Set state with parsed JSON data
            setEmail(data.userEmail || "None");
            setClinic(data.organization || "None");
            setPosition(data.roleName || "None");
            setStatus(data.status || "Not Certified");
        })
        .catch(error => console.error('Failed to fetch clinician details:', error));
    
    }, [clinicianId]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleClinicChange = (event) => {
        setClinic(event.target.value);
    };

    const handlePositionChange = (event) => {
        setPosition(event.target.value);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleSaveChanges = () => {
        // Implement logic to save changes to the database
    };

    return (
        <div className="flex">
            <div className="dashboard-container">
                <AdminDashboard />
            </div>
            <div className="clinician-profile-container">
                {clinicianDetails && (
                    <div className="clinician-details">
                        <h2>{clinicianDetails.firstName} {clinicianDetails.lastName}</h2>
                        <div className="personal-details-container">
                            <div className="personal-details-box">
                                <h3>Personal Details</h3>
                                <label>Email:</label>
                                <input type="text" value={email} onChange={handleEmailChange} />
                                <label>Clinic:</label>
                                <input type="text" value={clinic} onChange={handleClinicChange} />
                                <label>Position:</label>
                                <input type="text" value={position} onChange={handlePositionChange} />
                                <label>Status:</label>
                                <input type="text" value={status} onChange={handleStatusChange} />
                                <button onClick={handleSaveChanges}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AClinicianProfile;
