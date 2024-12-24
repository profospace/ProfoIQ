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
    const [showUserDetails, setShowUserDetails] = useState(true);
    const [singlePropertyStats, setSinglePropertyStats] = useState([]);

    console.log("highlightedDates", highlightedDates)
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get('https://propertify.onrender.com/api/builders/6763ca5d2c71a5e27c41f783/properties');
            if (response.data.success) {
                setProperties(response?.data?.data?.properties);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    const fetchInteraction = async (property) => {
        try {
            const response = await axios.get(`https://propertify.onrender.com/properties-interaction/api/interactions/stats?propertyId=${property?.post_id}`);
            const interactionData = response?.data?.data;
            setSinglePropertyStats(interactionData);
            filterActivitiesByDate(property?.post_id, selectedDate, interactionData);
        } catch (error) {
            console.error("Error fetching property interactions:", error);
        }
    };

    const handleBarClick = (event, elements) => {
        if (elements.length > 0) {
            const propertyIndex = elements[0].index;
            const property = properties[propertyIndex];
            setSelectedPropertyId(property?.post_id);
            fetchInteraction(property);
        }
    };

    // const filterActivitiesByDate = (propertyId, date, stats = singlePropertyStats) => {
    //     const formattedDate = date.toISOString().split('T')[0];
    //     const propertyStats = stats?.find((stat) => stat?.propertyId === propertyId && stat?.date === formattedDate);
    //     setFilteredActivities(propertyStats?.details || []);
    // };

    const filterActivitiesByDate = (propertyId, date, stats = singlePropertyStats) => {
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        const formattedDate = utcDate.toISOString().split('T')[0];

        const propertyStats = stats?.find((stat) => stat?.propertyId === propertyId && stat?.date === formattedDate);
        setFilteredActivities(propertyStats?.details || []);
    };


    // const handleDateChange = (date) => {
    //     setSelectedDate(date);
    //     if (selectedPropertyId) {
    //         filterActivitiesByDate(selectedPropertyId, date);
    //     }
    // };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (selectedPropertyId) {
            filterActivitiesByDate(selectedPropertyId, date);
        }
    };

    const toggleUserDetails = () => {
        setShowUserDetails((prevState) => !prevState);
    };

    const exportToExcel = () => {
        const data = filteredActivities.map((activity) => ({
            username: showUserDetails ? activity.userName : '✘',
            visited: activity.type === "VISIT" ? "✔" : "✘",
            visitType: activity?.metadata?.visitType || "N/A",
            deviceInfo: activity?.metadata?.deviceInfo || "N/A",
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Property Activity");
        XLSX.writeFile(wb, "property_activity.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const data = filteredActivities.map((activity) => [
            showUserDetails ? activity.userName : '✘',
            activity.type === "VISIT" ? "Yes" : "No",
            activity?.metadata?.visitType || "N/A",
            activity?.metadata?.deviceInfo || "N/A",
        ]);
        doc.autoTable({
            head: [['Username', 'Visited', 'Visit Type', 'Device Info']],
            body: data,
        });
        doc.save('property_activity.pdf');
    };

    // useEffect(() => {
    //     if (singlePropertyStats.length > 0) {
    //         const dates = singlePropertyStats.map(stat => stat.date); // Assuming dates are in 'YYYY-MM-DD' format
    //         setHighlightedDates(dates);
    //     }
    // }, [singlePropertyStats]);

    console.log(singlePropertyStats)
    useEffect(() => {
        if (singlePropertyStats.length > 0) {
            // Filter dates from the singlePropertyStats where the details array has data
            const highlightedDates = singlePropertyStats
                .filter(property => property.details && property.details.length > 0)  // Only pick properties with details data
                .map(property => property.date);  // Extract the date from those properties

            console.log("highlightedDates", highlightedDates)
            setHighlightedDates(highlightedDates);  // Set the highlighted dates for the calendar
        }
    }, [singlePropertyStats]);







    return (
        <div className="container mt-5">
            <h1>Real Estate Dashboard</h1>

            <div className="mt-4">
                <h3>Property Visits Chart</h3>
                <Bar
                    data={{
                        labels: properties.map((property) => property?.post_title),
                        datasets: [{
                            label: 'Number of Visits',
                            data: properties.map((property) => property?.visted || 0),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        }],
                    }}
                    options={{ onClick: handleBarClick }}
                />
            </div>

            {selectedPropertyId && (
                <div className="mt-4">
                    <h3>Activity for {properties?.find((p) => p.post_id === selectedPropertyId)?.post_title}</h3>

                    {/* <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={({ date, view }) => {
                            if (view === 'month') {
                                const formattedDate = date.toISOString().split('T')[0];
                                return highlightedDates.includes(formattedDate) ? 'highlight' : null;
                            }
                            return null;
                        }}
                    /> */}
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={({ date, view }) => {
                            if (view === 'month') {
                                const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                                const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
                                const formattedDate = utcDate.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'

                                return highlightedDates.includes(formattedDate) ? 'highlight' : null;
                            }
                            return null;
                        }}

                    />


                    <div className="mt-3">
                        <button onClick={toggleUserDetails} className="btn btn-info mb-3">
                            {showUserDetails ? 'Hide User Details' : 'Show User Details'}
                        </button>

                        {filteredActivities.length > 0 ? (
                            <>
                                <button onClick={exportToExcel} className="btn btn-success mr-2">Export to Excel</button>
                                <button onClick={exportToPDF} className="btn btn-danger">Export to PDF</button>
                                <div>Entries: {filteredActivities?.length} </div>
                                <div className='scrollView'>
                                    <table className="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th>Username</th>
                                                <th>Activity Type</th>
                                                <th>Timestamp</th>
                                                <th>Visit Type</th>
                                                <th>Device Info</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredActivities.map((activity, index) => (
                                                <tr key={index}>
                                                    <td>{showUserDetails ? activity.userName : '✘'}</td>
                                                    <td>{activity.type}</td>
                                                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                                                    <td>{activity?.metadata?.visitType || 'N/A'}</td>
                                                    <td>{activity?.metadata?.deviceInfo || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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

