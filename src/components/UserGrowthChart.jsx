import { Line } from 'react-chartjs-2';

const UserGrowthChart = ({ userData }) => {
    const data = {
        labels: userData.map((data) => data.date),
        datasets: [
            {
                label: 'Users Over Time',
                data: userData.map((data) => data.users),
                borderColor: '#42a5f5',
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className="growth-chart-card">
            <h3>User Growth Over Time</h3>
            <Line data={data} />
        </div>
    );
};
