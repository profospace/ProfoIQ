import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Placeholder data (to be replaced with API data later)
const placeholderProperties = [
    { id: 1, name: "Property 1", location: "Location A", visits: 10 },
    { id: 2, name: "Property 2", location: "Location B", visits: 20 },
];

const placeholderUsers = [
    { "id": 1, "name": "User 1", "phone": "123451000" },
    { "id": 2, "name": "User 2", "phone": "123451001" },
    { "id": 3, "name": "User 3", "phone": "123451002" },
    { "id": 4, "name": "User 4", "phone": "123451003" },
    { "id": 5, "name": "User 5", "phone": "123451004" },
    { "id": 6, "name": "User 6", "phone": "123451005" },
    { "id": 7, "name": "User 7", "phone": "123451006" },
    { "id": 8, "name": "User 8", "phone": "123451007" },
    { "id": 9, "name": "User 9", "phone": "123451008" },
    { "id": 10, "name": "User 10", "phone": "123451009" }
];


const placeholderActivities = [
    { "userId": 1, "propertyId": 1, "activity": "Visited", "timestamp": "2024-12-14T06:50:45", "saved": true, "contacted": true },
    { "userId": 1, "propertyId": 2, "activity": "Contacted", "timestamp": "2024-12-15T06:50:45", "saved": false, "contacted": false },
    { "userId": 1, "propertyId": 1, "activity": "Saved", "timestamp": "2024-12-16T06:50:45", "saved": true, "contacted": false },
    { "userId": 1, "propertyId": 2, "activity": "Visited", "timestamp": "2024-12-17T06:50:45", "saved": false, "contacted": true },
    { "userId": 1, "propertyId": 1, "activity": "Saved", "timestamp": "2024-12-18T06:50:45", "saved": true, "contacted": false },
    { "userId": 1, "propertyId": 2, "activity": "Contacted", "timestamp": "2024-12-19T06:50:45", "saved": false, "contacted": false },
    { "userId": 1, "propertyId": 1, "activity": "Visited", "timestamp": "2024-12-20T06:50:45", "saved": true, "contacted": true },
    { "userId": 1, "propertyId": 1, "activity": "Visited", "timestamp": "2024-12-21T06:50:45", "saved": true, "contacted": false },
    { "userId": 2, "propertyId": 1, "activity": "Visited", "timestamp": "2024-12-14T06:50:45", "saved": true, "contacted": true },
    { "userId": 2, "propertyId": 2, "activity": "Contacted", "timestamp": "2024-12-15T06:50:45", "saved": false, "contacted": false },
    { "userId": 2, "propertyId": 1, "activity": "Saved", "timestamp": "2024-12-16T06:50:45", "saved": true, "contacted": false }
]
;

const Dashboard = () => {
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [date, setDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState([]);

    // Function to extract the dates that have activity data
    useEffect(() => {
        const activityDates = dummyData.map(activity => new Date(activity.timestamp).toLocaleDateString());
        setHighlightedDates([...new Set(activityDates)]); // Remove duplicates
    }, []);

    // Function to handle date change
    const onDateChange = (newDate) => {
        setDate(newDate);
    };

    // Function to check if the date is highlighted
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const dateString = date.toLocaleDateString();
            if (highlightedDates.includes(dateString)) {
                return "highlighted";
            }
        }
        return "";
    };
    const chartData = {
        labels: placeholderProperties.map(property => property.name),
        datasets: [{
            label: 'Number of Visits',
            data: placeholderProperties.map(property => property.visits),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    // Handle bar chart click to show respective property data
    const handleBarClick = (event, elements) => {
        if (elements.length > 0) {
            const propertyIndex = elements[0].index;
            const property = placeholderProperties[propertyIndex];
            setSelectedPropertyId(property.id);
            filterActivitiesByDate(property.id, selectedDate);
        }
    };

    // Filter activities by selected property and date
    const filterActivitiesByDate = (propertyId, date) => {
        const formattedDate = date.toISOString().split('T')[0];
        const filtered = placeholderActivities.filter(
            activity =>
                activity.propertyId === propertyId &&
                activity.timestamp.startsWith(formattedDate)
        );
        setFilteredActivities(filtered);
    };

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (selectedPropertyId) {
            filterActivitiesByDate(selectedPropertyId, date);
        }
    };

    // Excel export function
    const exportToExcel = () => {
        const data = filteredActivities.map(activity => ({
            username: placeholderUsers.find(user => user.id === activity.userId).name,
            visited: activity.activity === "Visited" ? "✔" : "✘",
            saved: activity.saved ? "✔" : "✘",
            contacted: activity.contacted ? "✔" : "✘",
            phone: placeholderUsers.find(user => user.id === activity.userId).phone,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Property Activity");
        XLSX.writeFile(wb, "property_activity.xlsx");
    };

    // PDF export function
    const exportToPDF = () => {
        const doc = new jsPDF();
        const data = filteredActivities.map(activity => [
            placeholderUsers.find(user => user.id === activity.userId).name,
            activity.activity === "Visited" ? "✔" : "✘",
            activity.saved ? "✔" : "✘",
            activity.contacted ? "✔" : "✘",
            placeholderUsers.find(user => user.id === activity.userId).phone,
        ]);
        doc.autoTable({
            head: [['Username', 'Visited', 'Saved', 'Contacted', 'Phone']],
            body: data,
        });
        doc.save('property_activity.pdf');
    };

    return (
        <div className="container mt-5">
            <h1>Real Estate Dashboard</h1>

            <div className="mt-4">
                <h3>Property Visits Chart</h3>
                <Bar
                    data={chartData}
                    options={{
                        onClick: handleBarClick,
                    }}
                />
            </div>

            {selectedPropertyId && (
                <div className="mt-4">
                    <h3>Activity for {placeholderProperties.find(p => p.id === selectedPropertyId)?.name}</h3>

                    <DatePicker selected={selectedDate} onChange={handleDateChange} />

                    <div className="mt-3">
                        {filteredActivities.length > 0 ? (
                            <>
                                <button onClick={exportToExcel} className="btn btn-success mr-2">Export to Excel</button>
                                <button onClick={exportToPDF} className="btn btn-danger">Export to PDF</button>

                                <table className="table table-striped mt-3">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Visited</th>
                                            <th>Saved</th>
                                            <th>Contacted</th>
                                            <th>Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredActivities.map((activity, index) => {
                                            const user = placeholderUsers.find(user => user.id === activity.userId);
                                            return (
                                                <tr key={index}>
                                                    <td>{user.name}</td>
                                                    <td>{activity.activity === "Visited" ? "✔" : "✘"}</td>
                                                    <td>{activity.saved ? "✔" : "✘"}</td>
                                                    <td>{activity.contacted ? "✔" : "✘"}</td>
                                                    <td>{user.phone}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p>No data available for this day.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
