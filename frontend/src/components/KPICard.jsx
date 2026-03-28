import React from 'react';

export default function KPICard({ title, value, change, icon, color }) {
  const isPositive = parseFloat(change) >= 0;
  return (
    <div style={{
      background: '#1e293b', borderRadius: '12px', padding: '24px',
      border: '1px solid #334155', flex: '1', minWidth: '200px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{title}</p>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9' }}>{value}</p>
          <p style={{ fontSize: '13px', color: isPositive ? '#22c55e' : '#ef4444', marginTop: '6px' }}>
            {isPositive ? '▲' : '▼'} {change} vs last month
          </p>
        </div>
        <div style={{
          width: '48px', height: '48px', borderRadius: '10px',
          background: color + '22', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '22px'
        }}>{icon}</div>
      </div>
    </div>
  );
}