import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    const [status, setStatus] = useState("");
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
                const response = await fetch(`http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/ClinicianSearch/${clinicianId}`, requestOptions);
                if (!response.ok) {
                    if (response.status === 401) {
                        sessionStorage.removeItem('adminToken');
                        navigate('/adminlogin');
                    }
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setClinicianDetails(data[0]);
                setEmail(data[0].userEmail || "");
                setOrganization(data[0].organization.orgName);
                setPosition(data[0].role.roleName);
                setStatus(data[0].status || "Not Certified");
            } catch (error) {
                console.error('Failed to fetch clinician details:', error);
            }

            // Fetch organizations
            const orgsResponse = await fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetOrganizations');
            const orgsData = await orgsResponse.json();
            setOrganizations(orgsData.map(org => ({ name: org.orgName, id: org.orgID })));

            // Fetch roles
            const rolesResponse = await fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/GetRoles');
            const rolesData = await rolesResponse.json();
            setPositions(rolesData.map(role => ({ name: role.roleName, id: role.roleID })));
        };

        fetchDetails();
    }, [clinicianId, adminToken, navigate]);

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
        const response = await fetch('http://ghostcode-be-env-2.eba-va2d79t3.ap-southeast-2.elasticbeanstalk.com/webapi/EditClinician', requestOptions);
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
                                <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
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