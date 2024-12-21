// Import necessary modules
import React, { useState, useEffect } from "react";
import axios from "axios";

// Table Components
const PropertiesTable = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        axios.get("/api/properties")
            .then((response) => setProperties(response.data))
            .catch((error) => console.error("Error fetching properties:", error));
    }, []);

    return (
        <div className="mb-4">
            <h3>Properties</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Visits</th>
                        <th>Contacted</th>
                        <th>Saved</th>
                        <th>Shares</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map((property) => (
                        <tr key={property.id}>
                            <td>{property.id}</td>
                            <td>{property.name}</td>
                            <td>{property.location}</td>
                            <td>{property.visits}</td>
                            <td>{property.contacted}</td>
                            <td>{property.saved}</td>
                            <td>{property.shares}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const UsersTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("/api/users")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    return (
        <div className="mb-4">
            <h3>Users</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Visited</th>
                        <th>Saved</th>
                        <th>Contacted</th>
                        <th>Shares</th>
                        <th>Last Active</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.visited}</td>
                            <td>{user.saved}</td>
                            <td>{user.contacted}</td>
                            <td>{user.shares}</td>
                            <td>{user.lastActive}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const UserPropertyActivitiesTable = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios.get("/api/activities")
            .then((response) => setActivities(response.data))
            .catch((error) => console.error("Error fetching activities:", error));
    }, []);

    return (
        <div className="mb-4">
            <h3>User-Property Activities</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Activity ID</th>
                        <th>User ID</th>
                        <th>Property ID</th>
                        <th>Activity</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity) => (
                        <tr key={activity.id}>
                            <td>{activity.id}</td>
                            <td>{activity.userId}</td>
                            <td>{activity.propertyId}</td>
                            <td>{activity.activity}</td>
                            <td>{activity.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => (
    <div className="container mt-5">
        <h1>Real Estate Dashboard</h1>
        <PropertiesTable />
        <UsersTable />
        <UserPropertyActivitiesTable />
    </div>
);

// Export App Component
export default Dashboard;
