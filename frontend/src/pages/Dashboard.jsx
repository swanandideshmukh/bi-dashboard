import React, { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import BarChartWidget from '../components/BarChartWidget';
import LineChartWidget from '../components/LineChartWidget';
import PieChartWidget from '../components/PieChartWidget';
import DataTable from '../components/DataTable';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios.get(`${API}/api/data/summary`)
      .then(res => setSummary(res.data))
      .catch(() => setSummary({}));
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const revenueData = summary.monthly_revenue || [42000,55000,48000,61000,70000,65000,80000,75000,90000,85000,95000,102000];
  const usersData = summary.monthly_users || [120,180,160,210,250,230,300,280,340,310,370,400];
  const categoryLabels = summary.categories || ['Electronics','Clothing','Food','Software','Services'];
  const categoryData = summary.category_sales || [35,25,20,12,8];

  const tableHeaders = ['Month', 'Revenue', 'Users', 'Orders', 'Growth'];
  const tableRows = months.map((m, i) => [
    m,
    `$${(revenueData[i]/1000).toFixed(1)}k`,
    usersData[i],
    Math.floor(usersData[i] * 1.4),
    i === 0 ? '—' : `${(((revenueData[i]-revenueData[i-1])/revenueData[i-1])*100).toFixed(1)}%`
  ]);

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>Business Dashboard</h2>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Real-time analytics overview</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <KPICard title="Total Revenue" value="$102,000" change="+7.4%" icon="💰" color="#38bdf8" />
        <KPICard title="Total Users" value="3,450" change="+8.1%" icon="👥" color="#a78bfa" />
        <KPICard title="Orders" value="4,830" change="+5.2%" icon="🛒" color="#34d399" />
        <KPICard title="Avg. Order Value" value="$211" change="-1.3%" icon="📦" color="#fb923c" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <BarChartWidget title="Monthly Revenue ($)" labels={months} data={revenueData} />
        <LineChartWidget title="Monthly Active Users" labels={months} data={usersData} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
        <PieChartWidget title="Sales by Category" labels={categoryLabels} data={categoryData} />
        <DataTable headers={tableHeaders} rows={tableRows} />
      </div>
    </div>
  );
}