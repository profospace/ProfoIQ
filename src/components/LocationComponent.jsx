import React from 'react';

const LocationComponent = ({ locations }) => {
    return (
        <div className="location-dashboard">
            {locations.map((location, index) => (
                <div key={index} className="location-card" style={{ backgroundColor: location.users > 50 ? '#00C853' : '#FF7043' }}>
                    <div className="location-info">
                        <h5>{location.name}</h5>
                        <p>{location.users} Users</p>
                    </div>
                    <div className="location-bar" style={{ width: `${location.users}%` }} />
                </div>
            ))}
        </div>
    );
};

export default LocationComponent;
