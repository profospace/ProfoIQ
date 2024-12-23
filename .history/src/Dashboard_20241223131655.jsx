import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importing the autoTable plugin

import * as XLSX from 'xlsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [properties, setProperties] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [showUserDetails, setShowUserDetails] = useState(true); // Boolean flag to control user detail visibility

    // Fetch properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('http://localhost:5053/api/builders/6763ca5d2c71a5e27c41f783/properties');
                if (response.data.success) {
                    const propertiesData = response.data.data.properties.map((property) => ({
                        id: property.id,
                        name: property.title,
                        location: property.location,
                        visits: Math.floor(Math.random() * 100) + 1, // Generate random visits for chart
                    }));
                    console.log("propertiesData", propertiesData)
                    setProperties(propertiesData);
                }
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
    }, []);


   

    // Chart data
    const chartData = {
        labels: properties.map(property => property.name),
        datasets: [{
            label: 'Number of Visits',
            data: properties.map(property => property.visits),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const fetchInteraction = async ()=>{
        const response = await 

    }

    // Handle bar chart click to show respective property data
    const handleBarClick = (event, elements) => {
        
        fetchInteraction()

        if (elements.length > 0) {
            const propertyIndex = elements[0].index;
            const property = properties[propertyIndex];
            setSelectedPropertyId(property.id);
            filterActivitiesByDate(property.id, selectedDate);
        }
    };

    // useEffect(
    //     async () => {
    //         const response = await axios.get('http://localhost:5053/api/details/2319125479531')
    //         console.log(response)
    //     }, [handleBarClick]
    // )

    // Filter activities by selected property and date
    const filterActivitiesByDate = (propertyId, date) => {
        // Simulated activities logic; replace with actual API integration as needed
        const activities = properties.map(property => ({
            userId: Math.floor(Math.random() * 1000) + 1,
            propertyId: property.id,
            activity: 'Visited',
            timestamp: new Date().toISOString(),
            saved: Math.random() > 0.5,
            contacted: Math.random() > 0.5,
        }));
        const formattedDate = date.toISOString().split('T')[0];
        const filtered = activities.filter(
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

    // Toggle user details visibility
    const toggleUserDetails = () => {
        setShowUserDetails(prevState => !prevState);
    };

    // Excel export function
    const exportToExcel = () => {
        const data = filteredActivities.map(activity => ({
            username: showUserDetails ? `User ${activity.userId}` : '✘',
            visited: activity.activity === "Visited" ? "✔" : "✘",
            saved: activity.saved ? "✔" : "✘",
            contacted: activity.contacted ? "✔" : "✘",
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
        const data = filteredActivities.map(activity => ([
            showUserDetails ? `User ${activity.userId}` : '✘',
            activity.activity === "Visited" ? "Yes" : "No",
            activity.saved ? "Yes" : "No",
            activity.contacted ? "Yes" : "No",
        ]));

        // Use autoTable to generate the table in the PDF
        doc.autoTable({
            head: [['Username', 'Visited', 'Saved', 'Contacted']],
            body: data,
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
                    <h3>Activity for {properties.find(p => p.id === selectedPropertyId)?.name}</h3>

                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredActivities.map((activity, index) => (
                                            <tr key={index}>
                                                <td>{showUserDetails ? `User ${activity.userId}` : '✘'}</td>
                                                <td>{activity.activity === "Visited" ? "✔" : "✘"}</td>
                                                <td>{activity.saved ? "✔" : "✘"}</td>
                                                <td>{activity.contacted ? "✔" : "✘"}</td>
                                            </tr>
                                        ))}
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
