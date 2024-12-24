// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable'; // Importing the autoTable plugin

// import * as XLSX from 'xlsx';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';

// // Register the necessary chart components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const Dashboard = () => {
//     const [properties, setProperties] = useState([]);
//     const [selectedPropertyId, setSelectedPropertyId] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [filteredActivities, setFilteredActivities] = useState([]);
//     const [highlightedDates, setHighlightedDates] = useState([]);
//     const [showUserDetails, setShowUserDetails] = useState(true);
//     const [singlePropertyStats, setSinglePropertyStats] = useState([]);

//     console.log("singlePropertyStats", singlePropertyStats)
//     useEffect(() => {
//         fetchProperties();
//     }, []);

//     const fetchProperties = async () => {
//         try {
//             const response = await axios.get('https://propertify.onrender.com/api/builders/6763ca5d2c71a5e27c41f783/properties');
//             if (response.data.success) {
//                 setProperties(response?.data?.data?.properties);
//             }
//         } catch (error) {
//             console.error("Error fetching properties:", error);
//         }
//     };

//     const fetchInteraction = async (property) => {
//         try {
//             const response = await axios.get(`https://propertify.onrender.com/properties-interaction/api/interactions/stats?propertyId=${property?.post_id}`);
//             const interactionData = response?.data?.data;
//             setSinglePropertyStats(interactionData);
//             filterActivitiesByDate(property?.post_id, selectedDate, interactionData);
//         } catch (error) {
//             console.error("Error fetching property interactions:", error);
//         }
//     };

//     const handleBarClick = (event, elements) => {
//         if (elements.length > 0) {
//             const propertyIndex = elements[0].index;
//             const property = properties[propertyIndex];
//             setSelectedPropertyId(property?.post_id);
//             fetchInteraction(property);
//         }
//     };



//     const filterActivitiesByDate = (propertyId, date, stats = singlePropertyStats) => {
//         const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//         const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
//         const formattedDate = utcDate.toISOString().split('T')[0];

//         const propertyStats = stats?.find((stat) => stat?.propertyId === propertyId && stat?.date === formattedDate);
//         setFilteredActivities(propertyStats?.details || []);
//     };




//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//         if (selectedPropertyId) {
//             filterActivitiesByDate(selectedPropertyId, date);
//         }
//     };

//     const toggleUserDetails = () => {
//         setShowUserDetails((prevState) => !prevState);
//     };

//     const exportToExcel = () => {
//         const data = filteredActivities.map((activity) => ({
//             username: showUserDetails ? activity.userName : '✘',
//             visited: activity.type === "VISIT" ? "✔" : "✘",
//             visitType: activity?.metadata?.visitType || "N/A",
//             deviceInfo: activity?.metadata?.deviceInfo || "N/A",
//         }));
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Property Activity");
//         XLSX.writeFile(wb, "property_activity.xlsx");
//     };

//     const exportToPDF = () => {
//         const doc = new jsPDF();
//         const data = filteredActivities.map((activity) => [
//             showUserDetails ? activity.userName : '✘',
//             activity.type === "VISIT" ? "Yes" : "No",
//             activity?.metadata?.visitType || "N/A",
//             activity?.metadata?.deviceInfo || "N/A",
//         ]);
//         doc.autoTable({
//             head: [['Username', 'Visited', 'Visit Type', 'Device Info']],
//             body: data,
//         });
//         doc.save('property_activity.pdf');
//     };



//     console.log(singlePropertyStats)
//     useEffect(() => {
//         if (singlePropertyStats.length > 0) {
//             // Filter dates from the singlePropertyStats where the details array has data
//             const highlightedDates = singlePropertyStats
//                 .filter(property => property.details && property.details.length > 0)  // Only pick properties with details data
//                 .map(property => property.date);  // Extract the date from those properties

//             console.log("highlightedDates", highlightedDates)
//             setHighlightedDates(highlightedDates);  // Set the highlighted dates for the calendar
//         }
//     }, [singlePropertyStats]);







//     return (
//         <div className="container mt-5">
//             <h1>Real Estate Dashboard</h1>

//             <div className="mt-4">
//                 <h3>Property Visits Chart</h3>
//                 <Bar
//                     data={{
//                         labels: properties.map((property) => property?.post_title),
//                         datasets: [{
//                             label: 'Number of Visits',
//                             data: properties.map((property) => property?.visted || 0),
//                             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                             borderColor: 'rgba(75, 192, 192, 1)',
//                             borderWidth: 1,
//                         }],
//                     }}
//                     options={{ onClick: handleBarClick }}
//                 />
//             </div>

//             {selectedPropertyId && (
//                 <div className="mt-4">
//                     <h3>Activity for {properties?.find((p) => p.post_id === selectedPropertyId)?.post_title}</h3>


//                     <Calendar
//                         onChange={handleDateChange}
//                         value={selectedDate}
//                         tileClassName={({ date, view }) => {
//                             if (view === 'month') {
//                                 const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//                                 const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
//                                 const formattedDate = utcDate.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'

//                                 return highlightedDates.includes(formattedDate) ? 'highlight' : null;
//                             }
//                             return null;
//                         }}

//                     />


//                     <div className="mt-3">
//                         <button onClick={toggleUserDetails} className="btn btn-info mb-3">
//                             {showUserDetails ? 'Hide User Details' : 'Show User Details'}
//                         </button>

//                         {filteredActivities.length > 0 ? (
//                             <>
//                                 <button onClick={exportToExcel} className="btn btn-success mr-2">Export to Excel</button>
//                                 <button onClick={exportToPDF} className="btn btn-danger">Export to PDF</button>
//                                 <div>Entries: {filteredActivities?.length} </div>
//                                 <div className='scrollView'>
//                                     <table className="table table-striped mt-3">
//                                         <thead>
//                                             <tr>
//                                                 <th>Username</th>
//                                                 <th>Activity Type</th>
//                                                 <th>Timestamp</th>
//                                                 <th>Visit Type</th>
//                                                 <th>Device Info</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {filteredActivities.map((activity, index) => (
//                                                 <tr key={index}>
//                                                     <td>{showUserDetails ? activity.userName : '✘'}</td>
//                                                     <td>{activity.type}</td>
//                                                     <td>{new Date(activity.timestamp).toLocaleString()}</td>
//                                                     <td>{activity?.metadata?.visitType || 'N/A'}</td>
//                                                     <td>{activity?.metadata?.deviceInfo || 'N/A'}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </>
//                         ) : (
//                             <p>No data available for this day.</p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;

// *******************************************************************************************

// import React, { useState, useEffect } from 'react';
// import { Bar, Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable'; // Importing the autoTable plugin

// import * as XLSX from 'xlsx';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';

// // Register the necessary chart components
// ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// const Dashboard = () => {
//     const [properties, setProperties] = useState([]);
//     const [selectedPropertyId, setSelectedPropertyId] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [filteredActivities, setFilteredActivities] = useState([]);
//     const [highlightedDates, setHighlightedDates] = useState([]);
//     const [showUserDetails, setShowUserDetails] = useState(true);
//     const [singlePropertyStats, setSinglePropertyStats] = useState([]);
//     const [graphData, setGraphData] = useState({});

//     useEffect(() => {
//         fetchProperties();
//     }, []);

//     const fetchProperties = async () => {
//         try {
//             const response = await axios.get('https://propertify.onrender.com/api/builders/6763ca5d2c71a5e27c41f783/properties');
//             if (response.data.success) {
//                 setProperties(response?.data?.data?.properties);
//             }
//         } catch (error) {
//             console.error("Error fetching properties:", error);
//         }
//     };

//     const fetchInteraction = async (property) => {
//         try {
//             const response = await axios.get(`https://propertify.onrender.com/properties-interaction/api/interactions/stats?propertyId=${property?.post_id}`);
//             const interactionData = response?.data?.data;
//             setSinglePropertyStats(interactionData);
//             filterActivitiesByDate(property?.post_id, selectedDate, interactionData);
//         } catch (error) {
//             console.error("Error fetching property interactions:", error);
//         }
//     };

//     const handleBarClick = (event, elements) => {
//         if (elements.length > 0) {
//             const propertyIndex = elements[0].index;
//             const property = properties[propertyIndex];
//             setSelectedPropertyId(property?.post_id);
//             fetchInteraction(property);
//         }
//     };

//     const filterActivitiesByDate = (propertyId, date, stats = singlePropertyStats) => {
//         const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//         const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
//         const formattedDate = utcDate.toISOString().split('T')[0];

//         const propertyStats = stats?.find((stat) => stat?.propertyId === propertyId && stat?.date === formattedDate);
//         setFilteredActivities(propertyStats?.details || []);

//         // Prepare data for the line graph
//         if (propertyStats) {
//             const { visits, contacts, saves } = propertyStats.stats;
//             setGraphData({
//                 labels: [formattedDate],
//                 datasets: [
//                     {
//                         label: 'Visits',
//                         data: [visits],
//                         borderColor: 'rgba(75, 192, 192, 1)',
//                         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     },
//                     {
//                         label: 'Contacts',
//                         data: [contacts],
//                         borderColor: 'rgba(192, 75, 75, 1)',
//                         backgroundColor: 'rgba(192, 75, 75, 0.2)',
//                     },
//                     {
//                         label: 'Saves',
//                         data: [saves],
//                         borderColor: 'rgba(75, 75, 192, 1)',
//                         backgroundColor: 'rgba(75, 75, 192, 0.2)',
//                     },
//                 ],
//             });
//         } else {
//             setGraphData({});
//         }
//     };

//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//         if (selectedPropertyId) {
//             filterActivitiesByDate(selectedPropertyId, date);
//         }
//     };

//     const toggleUserDetails = () => {
//         setShowUserDetails((prevState) => !prevState);
//     };

//     const exportToExcel = () => {
//         const data = filteredActivities.map((activity) => ({
//             username: showUserDetails ? activity.userName : '✘',
//             visited: activity.type === "VISIT" ? "✔" : "✘",
//             visitType: activity?.metadata?.visitType || "N/A",
//             deviceInfo: activity?.metadata?.deviceInfo || "N/A",
//         }));
//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Property Activity");
//         XLSX.writeFile(wb, "property_activity.xlsx");
//     };

//     const exportToPDF = () => {
//         const doc = new jsPDF();
//         const data = filteredActivities.map((activity) => [
//             showUserDetails ? activity.userName : '✘',
//             activity.type === "VISIT" ? "Yes" : "No",
//             activity?.metadata?.visitType || "N/A",
//             activity?.metadata?.deviceInfo || "N/A",
//         ]);
//         doc.autoTable({
//             head: [['Username', 'Visited', 'Visit Type', 'Device Info']],
//             body: data,
//         });
//         doc.save('property_activity.pdf');
//     };

//     useEffect(() => {
//         if (singlePropertyStats.length > 0) {
//             const highlightedDates = singlePropertyStats
//                 .filter(property => property.details && property.details.length > 0)
//                 .map(property => property.date);

//             setHighlightedDates(highlightedDates);
//         }
//     }, [singlePropertyStats]);

//     return (
//         <div className="container mt-5">
//             <h1>Real Estate Dashboard</h1>

//             <div className="mt-4">
//                 <h3>Property Visits Chart</h3>
//                 <Bar
//                     data={{
//                         labels: properties.map((property) => property?.post_title),
//                         datasets: [{
//                             label: 'Number of Visits',
//                             data: properties.map((property) => property?.visted || 0),
//                             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                             borderColor: 'rgba(75, 192, 192, 1)',
//                             borderWidth: 1,
//                         }],
//                     }}
//                     options={{ onClick: handleBarClick }}
//                 />
//             </div>

//             {selectedPropertyId && (
//                 <div className="mt-4">
//                     <h3>Activity for {properties?.find((p) => p.post_id === selectedPropertyId)?.post_title}</h3>

//                     <Calendar
//                         onChange={handleDateChange}
//                         value={selectedDate}
//                         tileClassName={({ date, view }) => {
//                             if (view === 'month') {
//                                 const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//                                 const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
//                                 const formattedDate = utcDate.toISOString().split('T')[0];

//                                 return highlightedDates.includes(formattedDate) ? 'highlight' : null;
//                             }
//                             return null;
//                         }}
//                     />

//                     <div className="mt-4">
//                         {graphData.labels && graphData.labels.length > 0 && (
//                             <div className="mt-4">
//                                 <h3>Activity Summary</h3>
//                                 <Line
//                                     data={graphData}
//                                     options={{
//                                         responsive: true,
//                                         plugins: {
//                                             legend: { position: 'top' },
//                                             title: { display: true, text: 'Activity Trends' },
//                                         },
//                                     }}
//                                 />
//                             </div>
//                         )}

//                         <button onClick={toggleUserDetails} className="btn btn-info mb-3">
//                             {showUserDetails ? 'Hide User Details' : 'Show User Details'}
//                         </button>

//                         {filteredActivities.length > 0 ? (
//                             <>
//                                 <button onClick={exportToExcel} className="btn btn-success mr-2">Export to Excel</button>
//                                 <button onClick={exportToPDF} className="btn btn-danger">Export to PDF</button>
//                                 <div>Entries: {filteredActivities?.length} </div>
//                                 <div className='scrollView'>
//                                     <table className="table table-striped mt-3">
//                                         <thead>
//                                             <tr>
//                                                 <th>Username</th>
//                                                 <th>Activity Type</th>
//                                                 <th>Timestamp</th>
//                                                 <th>Visit Type</th>
//                                                 <th>Device Info</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {filteredActivities.map((activity, index) => (
//                                                 <tr key={index}>
//                                                     <td>{showUserDetails ? activity.userName : '✘'}</td>
//                                                     <td>{activity.type}</td>
//                                                     <td>{new Date(activity.timestamp).toLocaleString()}</td>
//                                                     <td>{activity?.metadata?.visitType || 'N/A'}</td>
//                                                     <td>{activity?.metadata?.deviceInfo || 'N/A'}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </>
//                         ) : (
//                             <p>No data available for this day.</p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;


// *******************************************************************************
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import html2canvas from 'html2canvas';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, annotationPlugin);

const Dashboard = () => {
    const [properties, setProperties] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [highlightedDates, setHighlightedDates] = useState([]);
    const [showUserDetails, setShowUserDetails] = useState(true);
    const [singlePropertyStats, setSinglePropertyStats] = useState([]);

    console.log("singlePropertyStats", singlePropertyStats)
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


    const filterActivitiesByDate = (propertyId, date, stats = singlePropertyStats) => {
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
        const formattedDate = utcDate.toISOString().split('T')[0];

        const propertyStats = stats?.find((stat) => stat?.propertyId === propertyId && stat?.date === formattedDate);
        setFilteredActivities(propertyStats?.details || []);
    };

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

    // const exportToPDF = () => {
    //     const doc = new jsPDF();
    //     const data = filteredActivities.map((activity) => [
    //         showUserDetails ? activity.userName : '✘',
    //         activity.type === "VISIT" ? "Yes" : "No",
    //         activity?.metadata?.visitType || "N/A",
    //         activity?.metadata?.deviceInfo || "N/A",
    //     ]);
    //     doc.autoTable({
    //         head: [['Username', 'Visited', 'Visit Type', 'Device Info']],
    //         body: data,
    //     });
    //     doc.save('property_activity.pdf');
    // };




    const exportToPDF = async () => {
        const doc = new jsPDF();

        // Find the property title
        const selectedProperty = properties.find(property => property.post_id === selectedPropertyId);
        const propertyTitle = selectedProperty ? selectedProperty.post_title : "Unknown Property";

        // Format the selected date
        const formattedDate = selectedDate.toLocaleDateString();

        // Add property title and selected date to the PDF header
        doc.setFontSize(16);
        doc.text(`Property: ${propertyTitle}`, 10, 10);
        doc.text(`Date: ${formattedDate}`, 10, 20);

        // Capture the Line chart as an image
        const chartContainer = document.getElementById('lineChartContainer'); // The container holding the Line chart
        html2canvas(chartContainer).then((canvas) => {
            // Convert the canvas to an image
            const chartImage = canvas.toDataURL('image/png');

            // Add the chart image to the PDF
            doc.addImage(chartImage, 'PNG', 10, 30, 180, 100); // Adjust positioning and size as needed

            // Prepare the data for the table
            const data = filteredActivities.map((activity) => [
                showUserDetails ? activity.userName : '✘',
                activity.type ? activity.type : 'N/A',
                // activity.timestamp ? activity.timestamp : 'N/A',
                activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString() : 'N/A',
                // activity.type === "VISIT" ? "Yes" : "No",
                activity?.metadata?.visitType || "N/A",
                activity?.metadata?.contact || "N/A",
                activity?.metadata?.email || "N/A",
                activity?.metadata?.deviceInfo || "N/A",
            ]);

            // Add the table below the chart image
            doc.autoTable({
                startY: 140, // Start the table below the chart
                head: [['Username', 'Activity Type', 'Time', 'Visit Type', 'Contact No.', 'Email', 'Device Info']],
                body: data,
            });

            // Save the document
            doc.save('property_activity.pdf');
        });
    };



    useEffect(() => {
        if (singlePropertyStats.length > 0) {
            const highlightedDates = singlePropertyStats
                .filter(property => property.details && property.details.length > 0)
                .map(property => property.date);

            setHighlightedDates(highlightedDates);
        }
    }, [singlePropertyStats]);

    const lineChartData = {
        labels: singlePropertyStats.map(stat => stat.date).sort((a, b) => new Date(a) - new Date(b)),
        datasets: [
            {
                label: 'Total Visits',
                data: singlePropertyStats.sort((a, b) => new Date(a.date) - new Date(b.date)).map(stat => stat.stats.visits || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
                fill: false,
            },
            {
                label: 'Total Contacts',
                data: singlePropertyStats.sort((a, b) => new Date(a.date) - new Date(b.date)).map(stat => stat.stats.contacts || 0),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
                fill: false,
            },
            {
                label: 'Total Saves',
                data: singlePropertyStats.sort((a, b) => new Date(a.date) - new Date(b.date)).map(stat => stat.stats.saves || 0),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.3,
                fill: false,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Trends for Visits, Contacts, and Saves',
            },
            annotation: {
                annotations: singlePropertyStats.map(stat => ({
                    type: 'line',
                    scaleID: 'x',
                    value: stat.date,
                    borderColor: 'rgba(0, 0, 0, 0.5)',
                    borderWidth: 1,
                    label: {
                        display: true,
                        content: stat.date,
                        position: 'start',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        font: {
                            size: 10,
                        },
                    },
                })),
            },
        },
    };


    console.log("highlightedDates", highlightedDates)
    const uniqueActivityTypes = [
        ...new Set(filteredActivities.map((activity) => activity.type)),
    ];

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

                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={({ date, view }) => {
                            if (view === 'month') {
                                const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                                const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
                                const formattedDate = utcDate.toISOString().split('T')[0];
                                console.log("formattedDate", formattedDate)

                                return highlightedDates.includes(formattedDate) ? 'highlight' : 'null';
                            }
                            return null;
                        }}
                    />



                    <div className="mt-4" id="lineChartContainer">
                        <h4>Summary Trends</h4>
                        <Line
                            data={lineChartData}
                            options={lineChartOptions}
                        />
                    </div>


                    <div className="mt-3">

                        {filteredActivities.length > 0 ? (
                            <>
                                <div className='d-flex gap-3 my-5'>
                                    <button onClick={toggleUserDetails} className="btn btn-info">
                                        {showUserDetails ? 'Hide User Details' : 'Show User Details'}
                                    </button>
                                    <button onClick={exportToExcel} className="btn btn-success mr-2">Export to Excel</button>
                                    <button onClick={exportToPDF} className="btn btn-danger">Export to PDF</button>
                                </div>
                                <div className='scrollView'>
                                    <div className="d-flex justify-content-end align-items-center gap-2 p-2 bg-light rounded shadow-sm">
                                        <span className="fw-semibold text-muted">Entries:</span>
                                        <span className="badge bg-primary">{filteredActivities?.length}</span>
                                    </div>

                                    <table className="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th>Username</th>
                                                <th>Activity Type</th>
                                                <th>Timestamp</th>
                                                <th>Visit Type</th>
                                                <th>Contact No.</th>
                                                <th>Email</th>
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
                                                    {/* <td>{activity?.metadata?.contact || 'N/A'}</td> */}
                                                    {/* <td>{activity?.metadata?.email || 'N/A'}</td> */}
                                                    <td>
                                                        {showUserDetails
                                                            ? (activity?.metadata?.contact || 'N/A')
                                                            : '✘'}
                                                    </td>

                                                    {/* Toggle Email */}
                                                    <td>
                                                        {showUserDetails
                                                            ? (activity?.metadata?.email || 'N/A')
                                                            : '✘'}
                                                    </td>
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

                    <div className="mt-3">
                        {filteredActivities.length > 0 ? (
                            <>
                                <div className="d-flex gap-3 my-5">
                                    <button onClick={toggleUserDetails} className="btn btn-info">
                                        {showUserDetails ? 'Hide User Details' : 'Show User Details'}
                                    </button>
                                    <button onClick={exportToExcel} className="btn btn-success mr-2">Export to Excel</button>
                                    <button onClick={exportToPDF} className="btn btn-danger">Export to PDF</button>
                                </div>
                                <div className="scrollView">
                                    <div className="d-flex justify-content-end align-items-center gap-2 p-2 bg-light rounded shadow-sm">
                                        <span className="fw-semibold text-muted">Entries:</span>
                                        <span className="badge bg-primary">{filteredActivities?.length}</span>
                                    </div>

                                    {/* Dynamically create table */}
                                    <table className="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th>Username</th>
                                                {showUserDetails && <th>Contact No.</th>}
                                                {showUserDetails && <th>Email</th>}
                                                <th>Timestamp</th>
                                                {uniqueActivityTypes.map((type, index) => (
                                                    <th key={index}>{type}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredActivities.map((activity, index) => (
                                                <tr key={index}>
                                                    <td>{showUserDetails ? activity.userName : '✘'}</td>
                                                    {showUserDetails && <td>{activity?.metadata?.contact || 'N/A'}</td>}
                                                    {showUserDetails && <td>{activity?.metadata?.email || 'N/A'}</td>}
                                                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                                                    {uniqueActivityTypes.map((type, i) => (
                                                        <td key={i}>
                                                            {activity.type === type ? '✔' : '✘'}
                                                        </td>
                                                    ))}
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
