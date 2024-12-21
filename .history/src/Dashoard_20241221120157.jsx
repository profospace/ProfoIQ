import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Chart } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { jsPDF } from "jspdf";
import { html2pdf } from 'react-html2pdf';

// Placeholder data
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

// Chart data preparation
const chartData = {
    labels: placeholderProperties.map(property => property.name),
    datasets: [{
        label: 'Number of Visits',
        data: placeholderProperties.map(property => property.visits),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

const PropertiesTable = () => {
    const [properties, setProperties] = useState(placeholderProperties);

    // Function to export to Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(properties);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Properties");
        XLSX.writeFile(wb, "properties.xlsx");
    };

    // Function to export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Name', 'Location', 'Visits', 'Contacted', 'Saved', 'Shares']],
            body: properties.map(p => [p.id, p.name, p.location, p.visits, p.contacted, p.saved, p.shares])
        });
        doc.save('properties.pdf');
    };

    return (
        <div className="mb-4">
            <h3>Properties</h3>
            <button onClick={exportToExcel} className="btn btn-success mr-2">Export to Excel</button>
            <button onClick={exportToPDF} className="btn btn-danger">Export to PDF</button>
            <table className="table table-striped mt-3">
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

const VisitorTableForEachProperty = () => {
    return (
        <div className="mb-4">
            <h3>Visitor Data</h3>
            {placeholderProperties.map((property) => (
                <div key={property.id}>
                    <h4>Visitors for {property.name}</h4>
                    <table className="table table-striped mt-2">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>Activity</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placeholderActivities.filter(activity => activity.propertyId === property.id).map((activity) => (
                                <tr key={activity.id}>
                                    <td>{activity.userId}</td>
                                    <td>{placeholderUsers.find(user => user.id === activity.userId).name}</td>
                                    <td>{activity.activity}</td>
                                    <td>{activity.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => (
    <div className="container mt-5">
        <h1>Real Estate Dashboard</h1>
        <PropertiesTable />
        <VisitorTableForEachProperty />
        <div className="mt-4">
            <h3>Property Visits Chart</h3>
            <Bar data={chartData} />
        </div>
    </div>
);

export default Dashboard;
