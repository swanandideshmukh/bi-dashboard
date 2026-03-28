import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/import', label: 'Import Data', icon: '📥' },
  { path: '/reports', label: 'Reports', icon: '📄' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <div style={{
      width: '240px', background: '#1e293b', padding: '24px 16px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      borderRight: '1px solid #334155', minHeight: '100vh'
    }}>
      <div style={{ padding: '16px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#38bdf8' }}>
          📈 BI Dashboard
        </h1>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          Analytics Platform
        </p>
      </div>
      {links.map(link => (
        <Link key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
            background: location.pathname === link.path ? '#0ea5e9' : 'transparent',
            color: location.pathname === link.path ? '#fff' : '#94a3b8',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '14px', fontWeight: '500',
            transition: 'all 0.2s'
          }}>
            <span>{link.icon}</span> {link.label}
          </div>
        </Link>
      ))}
    </div>
  );
}