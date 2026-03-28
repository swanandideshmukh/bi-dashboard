import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function LineChartWidget({ title, labels, data }) {
  const chartData = {
    labels,
    datasets: [{
      label: title,
      data,
      borderColor: '#a78bfa',
      backgroundColor: 'rgba(167,139,250,0.15)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#a78bfa',
    }]
  };
  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    }
  };
  return (
    <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
      <h3 style={{ marginBottom: '16px', color: '#e2e8f0', fontSize: '15px' }}>{title}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}