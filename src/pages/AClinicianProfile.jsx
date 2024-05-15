import React, { useEffect, useState } from 'react';
import { useParams,  } from 'react-router-dom';
import AdminDashboard from "../components/Dashboards/ADashboard";
import AdminInfo from "../components/AdminComponent/adminInfo";
import { Link, useNavigate } from "react-router-dom";
import './AClinicianProfile.css';


function AClinicianProfile() {
    const { clinicianId } = useParams();
    const [clinicianDetails, setClinicianDetails] = useState(null);
    const [email, setEmail] = useState("");
    const [organization, setOrganization] = useState("");
    const [position, setPosition] = useState("");

    const [status, setStatus] = useState();
    const [initialStatus, setInitialStatus] = useState();

    const [organizations, setOrganizations] = useState([]);
    const [positions, setPositions] = useState([]);
    const adminToken = sessionStorage.getItem('adminToken');

    
  

    



    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            };
            try {
                const response = await fetch(`https://api.tmstrainingquizzes.com/webapi/ClinicianSearch/${clinicianId}`, requestOptions);
                if (response.ok) {
                    const data = await response.json();
                    setClinicianDetails(data[0]);
                    setEmail(data[0].userEmail || "");  
                    setOrganization(data[0].organization.orgName);
                    setPosition(data[0].role.roleName);
                } else if (response.status === 401) {
                    sessionStorage.removeItem('adminToken');
                    navigate('/adminlogin');
                }
            } catch (error) {
                console.error('Failed to fetch clinician details:', error);
            }

            // Fetch organizations
            const orgsResponse = await fetch('https://api.tmstrainingquizzes.com/webapi/GetOrganizations');
            const orgsData = await orgsResponse.json();
            setOrganizations(orgsData.map(org => ({ name: org.orgName, id: org.orgID })));

            // Fetch roles
            const rolesResponse = await fetch('https://api.tmstrainingquizzes.com/webapi/GetRoles');
            const rolesData = await rolesResponse.json();
            setPositions(rolesData.map(role => ({ name: role.roleName, id: role.roleID })));

           
        };

        fetchDetails();
    }, [clinicianId, adminToken, navigate]);


    useEffect(() => {
        if (clinicianDetails) {
            const fetchCertificationStatus = async () => {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${adminToken}`
                    }
                };

                try {
                    const certResponse = await fetch(`https://api.tmstrainingquizzes.com/webapi/GetClinicianCertificationStatus/${clinicianDetails.userID}`, requestOptions);
                if (certResponse.ok) {
                    const certData = await certResponse.json();
                    console.log(certData);

                    // Check if certification has expired
                    const expiryDateTime = new Date(certData[certData.length -1].expiryDateTime);
                    console.log(expiryDateTime)
                    const currentDateTime = new Date();

                    if (currentDateTime > expiryDateTime) {
                        // If certification has expired, set status to Not Certified
                        setStatus("Not Certified");
                        setInitialStatus("Not Certified");
                    } else {
                        setStatus("Certified");
                        setInitialStatus("Certified");
                    }
                } else if (certResponse.status === 404) {
                    setStatus("Not Certified");
                    setInitialStatus("Not Certified");
                }
            } catch (error) {
                console.error('Failed to fetch certification status:', error);
            }
        };
        fetchCertificationStatus();
    }
}, [clinicianDetails, adminToken]);


    async function setClinicianCertificationStatus() {
        const url = 'https://api.tmstrainingquizzes.com/webapi/SetClinicianCertificationStatus';
        const data = {
            UserID: clinicianDetails.userID,
            Type: 'InitCertification'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update certification status');

            const result = await response.json();
            console.log('Certification status updated:', result);
            setStatus("Certified");
            setInitialStatus("Certified");
        } catch (error) {
            console.error('Error updating certification status:', error);
        }
    }




   const handleSaveChanges = async () => {
    // Find the selected role and organization IDs
    const selectedRole = positions.find(role => role.name === position);
    const selectedOrg = organizations.find(org => org.name === organization);
    console.log(selectedOrg);
    console.log(selectedRole);

    const requestBody = {
        userID: clinicianDetails.userID,
        userEmail: email,
        firstName: clinicianDetails.firstName,
        lastName: clinicianDetails.lastName,
        roleID: selectedRole.id,
        organizationID: selectedOrg.id
     
    };

    const requestOptions = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}` // Include token in headers
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch('https://api.tmstrainingquizzes.com/webapi/EditClinician', requestOptions);
        if (response.ok) {
            alert('Clinician updated successfully!');
        } else if (response.status === 409) {
            throw new Error('A user with this email already exists.');
        } else {
            throw new Error('Failed to update clinician');
        }
    } catch (error) {
        console.error('Error updating clinician:', error);
        alert(error.message);
    }

    if (initialStatus === 'Not Certified' && status === 'Certified') {
        await setClinicianCertificationStatus();
    }
    
};

return (
    <div className="flex">
        <div className="dashboard-container">
            <AdminDashboard />
        </div>
        <div className="AdminClientSearchContainer">
            <AdminInfo />
            <div className="clinician-profile-container">
                {clinicianDetails && (
                    <div className="clinician-details">
                        <h2>{clinicianDetails.firstName} {clinicianDetails.lastName}</h2>
                        <div className="personal-details-container">
                            <div className="personal-details-box">
                                <h3>Personal Details</h3>
                                <label>Email:</label>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label>Organization:</label>
                                <select value={organization} onChange={(e) => setOrganization(e.target.value)}>
                                    {organizations.map(org => (
                                        <option key={org.id} value={org.name}>{org.name}</option>
                                    ))}
                                </select>
                                <label>Position:</label>
                                <select value={position} onChange={(e) => setPosition(e.target.value)}>
                                    {positions.map(pos => (
                                        <option key={pos.id} value={pos.name}>{pos.name}</option>
                                    ))}
                                </select>
                                <label>Status:</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Not Certified">Not Certified</option>
                                    <option value="Certified">Certified</option>
                                </select>
                                <button onClick={handleSaveChanges}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
}

export default AClinicianProfile;