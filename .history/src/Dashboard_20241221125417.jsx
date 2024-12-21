import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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
];

const Dashboard = () => {
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [showUserDetails, setShowUserDetails] = useState(true); // Boolean flag to control user detail visibility

    // Chart data
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

    // Extract the dates with activities to highlight
    useEffect(() => {
        const activityDates = placeholderActivities.map(activity => new Date(activity.timestamp).toLocaleDateString());
        setHighlightedDates([...new Set(activityDates)]);
    }, []);

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

    // Check if the date has data and highlight it
    const tileClassName = ({ date }) => {
        const dateString = date.toLocaleDateString();
        if (highlightedDates.includes(dateString)) {
            return 'highlighted';
        }
        return '';
    };

    // Toggle user details visibility
    const toggleUserDetails = () => {
        setShowUserDetails(prevState => !prevState);
    };

    // Excel export function
    const exportToExcel = () => {
        const data = filteredActivities.map(activity => ({
            username: showUserDetails ? placeholderUsers.find(user => user.id === activity.userId)?.name : '✘',
            visited: activity.activity === "Visited" ? "✔" : "✘",
            saved: activity.saved ? "✔" : "✘",
            contacted: activity.contacted ? "✔" : "✘",
            phone: showUserDetails ? placeholderUsers.find(user => user.id === activity.userId)?.phone : '✘',
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Property Activity");
        XLSX.writeFile(wb, "property_activity.xlsx");
    };

    // PDF export function
    const exportToPDF = () => {
        const doc = new jsPDF();

        // Prepare the data for the table
        const data = filteredActivities.map(activity => {
            const user = placeholderUsers.find(user => user.id === activity.userId);
            return [
                showUserDetails ? user?.name : '✘', // Conditionally hide/show user name
                activity.activity === "Visited" ? "✔" : "✘",
                activity.saved ? "✔" : "✘",
                activity.contacted ? "✔" : "✘",
                showUserDetails ? user?.phone : '✘' // Conditionally hide/show phone number
            ];
        });

        // Use autoTable to generate the table in the PDF
        doc.autoTable({
            head: [['Username', 'Visited', 'Saved', 'Contacted', 'Phone']], // Table headers
            body: data, // Table rows
        });

        // Save the PDF file
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

                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={tileClassName}
                    />

                    <div className="mt-3">
                        <button onClick={toggleUserDetails} className="btn btn-info mb-3">
                            {showUserDetails ? 'Hide User Details' : 'Show User Details'}
                        </button>

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
                                                    <td>{showUserDetails ? user?.name : '✘'}</td>
                                                    <td>{activity.activity === "Visited" ? "✔" : "✘"}</td>
                                                    <td>{activity.saved ? "✔" : "✘"}</td>
                                                    <td>{activity.contacted ? "✔" : "✘"}</td>
                                                    <td>{showUserDetails ? user?.phone : '✘'}</td>
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