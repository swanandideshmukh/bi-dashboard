import React, { useState } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

export default function Import({ setImportedData }) {
  const [preview, setPreview] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        setHeaders(Object.keys(data[0] || {}));
        setPreview(data.slice(0, 5));
        setParsedData(data);
        setStatus('✅ File parsed successfully. Preview below.');
      }
    });
  };

  const handleImport = () => {
    if (!parsedData) return;

    // Try to extract monthly revenue, users, orders from CSV
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const monthly_revenue = parsedData.slice(0, 12).map(row => {
      const val = row.revenue || row.Revenue || row.REVENUE || row.sales || row.Sales || 0;
      return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
    });

    const monthly_users = parsedData.slice(0, 12).map(row => {
      const val = row.users || row.Users || row.USERS || row.customers || row.Customers || 0;
      return parseInt(String(val).replace(/[^0-9]/g, '')) || 0;
    });

    const monthly_orders = parsedData.slice(0, 12).map(row => {
      const val = row.orders || row.Orders || row.ORDERS || 0;
      return parseInt(String(val).replace(/[^0-9]/g, '')) || 0;
    });

    const monthly_labels = parsedData.slice(0, 12).map((row, i) => {
      return row.month || row.Month || row.MONTH || row.period || row.Period || months[i];
    });

    const totalRevenue = monthly_revenue.reduce((a, b) => a + b, 0);
    const totalUsers = monthly_users.reduce((a, b) => a + b, 0);
    const totalOrders = monthly_orders.reduce((a, b) => a + b, 0);
    const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

    setImportedData({
      monthly_revenue,
      monthly_users,
      monthly_orders,
      monthly_labels,
      totalRevenue,
      totalUsers,
      totalOrders,
      avgOrder,
      categories: ['Electronics','Clothing','Food','Software','Services'],
      category_sales: [35, 25, 20, 12, 8]
    });

    setStatus('✅ Dashboard updated with your data!');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Import Data</h2>
      <p style={{ color: '#64748b', marginBottom: '28px' }}>Upload a CSV file with columns: month, revenue, users, orders</p>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '32px', border: '2px dashed #334155', textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📥</p>
        <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Upload your CSV file</p>
        <p style={{ color: '#475569', fontSize: '12px', marginBottom: '16px' }}>Expected columns: month, revenue, users, orders</p>
        <input type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} id="fileInput" />
        <label htmlFor="fileInput" style={{
          background: '#0ea5e9', color: '#fff', padding: '10px 24px',
          borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
        }}>Choose CSV File</label>
        {fileName && <p style={{ color: '#38bdf8', marginTop: '12px', fontSize: '14px' }}>📎 {fileName}</p>}
      </div>

      {status && (
        <p style={{ color: '#34d399', marginBottom: '16px', fontSize: '14px' }}>{status}</p>
      )}

      {preview.length > 0 && (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155', overflowX: 'auto', marginBottom: '20px' }}>
          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Preview (first 5 rows)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>{headers.map(h => (
                <th key={h} style={{ padding: '8px 12px', color: '#64748b', borderBottom: '1px solid #334155', textAlign: 'left' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {headers.map(h => (
                    <td key={h} style={{ padding: '8px 12px', color: '#cbd5e1', borderBottom: '1px solid #1e293b' }}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview.length > 0 && (
        <button onClick={handleImport} style={{
          background: '#0ea5e9', color: '#fff', border: 'none',
          padding: '12px 28px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600'
        }}>🚀 Import & Update Dashboard</button>
      )}

      <div style={{ marginTop: '32px', background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
        <h3 style={{ color: '#e2e8f0', marginBottom: '12px' }}>📋 Sample CSV Format</h3>
        <pre style={{ color: '#94a3b8', fontSize: '13px', overflowX: 'auto' }}>
{`month,revenue,users,orders
Jan,42000,120,168
Feb,55000,180,251
Mar,48000,160,224
Apr,61000,210,294
May,70000,250,350
Jun,65000,230,322`}
        </pre>
        <button onClick={() => {
          const csv = `month,revenue,users,orders\nJan,42000,120,168\nFeb,55000,180,251\nMar,48000,160,224\nApr,61000,210,294\nMay,70000,250,350\nJun,65000,230,322`;
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'sample_data.csv';
          a.click();
        }} style={{
          background: '#334155', color: '#e2e8f0', border: 'none',
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '13px', marginTop: '12px'
        }}>⬇️ Download Sample CSV</button>
      </div>
    </div>
  );
}