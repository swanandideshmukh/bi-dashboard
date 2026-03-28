import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reports() {
  const [reportType, setReportType] = useState('revenue');

  const reports = {
    revenue: {
      title: 'Revenue Report — Q1 to Q4',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [145000, 196000, 245000, 282000],
      color: '#38bdf8'
    },
    users: {
      title: 'User Growth Report',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [460, 690, 930, 1070],
      color: '#a78bfa'
    },
    orders: {
      title: 'Orders Report',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [644, 966, 1302, 1498],
      color: '#34d399'
    }
  };

  const current = reports[reportType];

  const chartData = {
    labels: current.labels,
    datasets: [{
      label: current.title,
      data: current.data,
      backgroundColor: current.color + 'cc',
      borderColor: current.color,
      borderWidth: 1,
      borderRadius: 6
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

  const handleExport = () => {
    const csvRows = [
      current.labels.join(','),
      current.data.join(',')
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report.csv`;
    a.click();
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Reports</h2>
      <p style={{ color: '#64748b', marginBottom: '28px' }}>Generate and export business reports</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {Object.keys(reports).map(key => (
          <button key={key} onClick={() => setReportType(key)} style={{
            padding: '10px 20px', borderRadius: '8px', border: 'none',
            background: reportType === key ? '#0ea5e9' : '#1e293b',
            color: reportType === key ? '#fff' : '#94a3b8',
            cursor: 'pointer', fontSize: '14px', fontWeight: '500',
            textTransform: 'capitalize'
          }}>{key}</button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155', marginBottom: '20px' }}>
        <h3 style={{ color: '#e2e8f0', marginBottom: '20px' }}>{current.title}</h3>
        <Bar data={chartData} options={options} />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handleExport} style={{
          background: '#0ea5e9', color: '#fff', border: 'none',
          padding: '12px 28px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600'
        }}>⬇️ Export as CSV</button>
        <button onClick={() => window.print()} style={{
          background: '#334155', color: '#e2e8f0', border: 'none',
          padding: '12px 28px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600'
        }}>🖨️ Print Report</button>
      </div>
    </div>
  );
}
