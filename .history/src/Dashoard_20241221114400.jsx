// Import necessary modules
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Table Components
const PropertiesTable = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/properties")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setProperties(response.data);
                } else {
                    throw new Error("Unexpected response format");
                }
            })
            .catch((error) => {
                console.error("Error fetching properties:", error);
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div>Error loading properties: {error}</div>;
    }

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
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/users")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    throw new Error("Unexpected response format");
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div>Error loading users: {error}</div>;
    }

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
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/activities")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setActivities(response.data);
                } else {
                    throw new Error("Unexpected response format");
                }
            })
            .catch((error) => {
                console.error("Error fetching activities:", error);
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div>Error loading activities: {error}</div>;
    }

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

export default Dashboard;
