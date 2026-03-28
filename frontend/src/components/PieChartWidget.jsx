import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartWidget({ title, labels, data }) {
  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: ['#38bdf8','#a78bfa','#34d399','#fb923c','#f472b6'],
      borderColor: '#1e293b',
      borderWidth: 2,
    }]
  };
  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' }, position: 'bottom' } }
  };
  return (
    <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
      <h3 style={{ marginBottom: '16px', color: '#e2e8f0', fontSize: '15px' }}>{title}</h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}