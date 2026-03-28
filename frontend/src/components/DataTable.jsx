import React from 'react';

export default function DataTable({ headers = [], rows = [] }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', borderBottom: '1px solid #334155', fontWeight: '600' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 14px', color: '#cbd5e1' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}