import React from 'react';
import KPICard from '../components/KPICard';
import BarChartWidget from '../components/BarChartWidget';
import LineChartWidget from '../components/LineChartWidget';
import PieChartWidget from '../components/PieChartWidget';
import DataTable from '../components/DataTable';

export default function Dashboard({ importedData }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const revenueData = importedData?.monthly_revenue || [42000,55000,48000,61000,70000,65000,80000,75000,90000,85000,95000,102000];
  const usersData = importedData?.monthly_users || [120,180,160,210,250,230,300,280,340,310,370,400];
  const labels = importedData?.monthly_labels || months;
  const categoryLabels = importedData?.categories || ['Electronics','Clothing','Food','Software','Services'];
  const categoryData = importedData?.category_sales || [35,25,20,12,8];

  const totalRevenue = importedData?.totalRevenue
    ? `$${Number(importedData.totalRevenue).toLocaleString()}`
    : '$102,000';
  const totalUsers = importedData?.totalUsers
    ? Number(importedData.totalUsers).toLocaleString()
    : '3,450';
  const totalOrders = importedData?.totalOrders
    ? Number(importedData.totalOrders).toLocaleString()
    : '4,830';
  const avgOrder = importedData?.avgOrder
    ? `$${importedData.avgOrder}`
    : '$211';

  const tableHeaders = ['Month', 'Revenue', 'Users', 'Orders', 'Growth'];
  const tableRows = labels.map((m, i) => [
    m,
    `$${(revenueData[i]/1000).toFixed(1)}k`,
    usersData[i],
    Math.floor(usersData[i] * 1.4),
    i === 0 ? '—' : `${(((revenueData[i]-revenueData[i-1])/revenueData[i-1])*100).toFixed(1)}%`
  ]);

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>Business Dashboard</h2>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            {importedData ? '📊 Showing your imported data' : 'Real-time analytics overview'}
          </p>
        </div>
        {importedData && (
          <span style={{ background: '#22c55e22', color: '#22c55e', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
            ✅ Custom Data Active
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <KPICard title="Total Revenue" value={totalRevenue} change="+7.4%" icon="💰" color="#38bdf8" />
        <KPICard title="Total Users" value={totalUsers} change="+8.1%" icon="👥" color="#a78bfa" />
        <KPICard title="Orders" value={totalOrders} change="+5.2%" icon="🛒" color="#34d399" />
        <KPICard title="Avg. Order Value" value={avgOrder} change="-1.3%" icon="📦" color="#fb923c" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <BarChartWidget title="Monthly Revenue ($)" labels={labels} data={revenueData} />
        <LineChartWidget title="Monthly Active Users" labels={labels} data={usersData} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
        <PieChartWidget title="Sales by Category" labels={categoryLabels} data={categoryData} />
        <DataTable headers={tableHeaders} rows={tableRows} />
      </div>
    </div>
  );
}
