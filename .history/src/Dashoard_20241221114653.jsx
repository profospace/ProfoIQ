// Import necessary modules
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Placeholder data for independent rendering when API data is unavailable
const placeholderProperties = [
    { id: 1, name: "Property 1", location: "Location A", visits: 10, contacted: 5, saved: 3, shares: 2 },
    { id: 2, name: "Property 2", location: "Location B", visits: 20, contacted: 8, saved: 6, shares: 4 },
];

const placeholderUsers = [
    { id: 1, name: "User 1", email: "user1@example.com", visited: 15, saved: 5, contacted: 3, shares: 2, lastActive: "2023-12-20" },
    { id: 2, name: "User 2", email: "user2@example.com", visited: 25, saved: 10, contacted: 8, shares: 5, lastActive: "2023-12-19" },
];

const placeholderActivities = [
    { id: 1, userId: 1, propertyId: 1, activity: "Visited", timestamp: "2023-12-20T10:00:00" },
    { id: 2, userId: 2, propertyId: 2, activity: "Saved", timestamp: "2023-12-20T11:00:00" },
];

// Table Components
const PropertiesTable = () => {
    const [properties, setProperties] = useState(placeholderProperties);

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
                    {properties?.length>0 && properties?.map((property) => (
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
    const [users, setUsers] = useState(placeholderUsers);

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
    const [activities, setActivities] = useState(placeholderActivities);

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
