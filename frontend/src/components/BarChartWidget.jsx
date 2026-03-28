import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChartWidget({ title, labels, data }) {
  const chartData = {
    labels,
    datasets: [{
      label: title,
      data,
      backgroundColor: 'rgba(56,189,248,0.7)',
      borderColor: '#38bdf8',
      borderWidth: 1,
      borderRadius: 6,
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
      <Bar data={chartData} options={options} />
    </div>
  );
}