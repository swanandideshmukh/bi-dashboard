'use client';
import React, { useState } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data;
        setHeaders(Object.keys(data[0] || {}));
        setPreview(data.slice(0, 5));
        setParsedData(data);
        setStatus('✅ File parsed successfully. Preview below.');
      }
    });
  };

  const findColumn = (row, possibleNames) => {
    for (const name of possibleNames) {
      const key = Object.keys(row).find(k => k.toLowerCase().trim() === name.toLowerCase());
      if (key !== undefined) return key;
    }
    return null;
  };

  const handleImport = () => {
    if (!parsedData || parsedData.length === 0) return;

    const firstRow = parsedData[0];

    // Find column names flexibly
    const monthKey = findColumn(firstRow, ['month', 'months', 'period', 'date', 'time']);
    const revenueKey = findColumn(firstRow, ['revenue', 'sales', 'income', 'earnings', 'amount']);
    const usersKey = findColumn(firstRow, ['users', 'customers', 'clients', 'visitors', 'people']);
    const ordersKey = findColumn(firstRow, ['orders', 'transactions', 'purchases', 'orders_count']);

    const monthly_labels = parsedData.map((row, i) => {
      if (monthKey) return String(row[monthKey]);
      return `Row ${i + 1}`;
    });

    const monthly_revenue = parsedData.map(row => {
      if (!revenueKey) return 0;
      const val = row[revenueKey];
      return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
    });

    const monthly_users = parsedData.map(row => {
      if (!usersKey) return 0;
      const val = row[usersKey];
      return parseInt(String(val).replace(/[^0-9]/g, '')) || 0;
    });

    const monthly_orders = parsedData.map(row => {
      if (!ordersKey) return 0;
      const val = row[ordersKey];
      return parseInt(String(val).replace(/[^0-9]/g, '')) || 0;
    });

    const totalRevenue = monthly_revenue.reduce((a, b) => a + b, 0);
    const totalUsers = monthly_users.reduce((a, b) => a + b, 0);
    const totalOrders = monthly_orders.reduce((a, b) => a + b, 0);
    const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

    // Build category data from unique months or any category column
    const categoryKey = findColumn(firstRow, ['category', 'type', 'product', 'segment']);
    let categories = ['Electronics', 'Clothing', 'Food', 'Software', 'Services'];
    let category_sales = [35, 25, 20, 12, 8];

    if (categoryKey) {
      const categoryCount = {};
      parsedData.forEach(row => {
        const cat = String(row[categoryKey]);
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      categories = Object.keys(categoryCount);
      category_sales = Object.values(categoryCount);
    }

    setImportedData({
      monthly_revenue,
      monthly_users,
      monthly_orders,
      monthly_labels,
      totalRevenue,
      totalUsers,
      totalOrders,
      avgOrder,
      categories,
      category_sales,
      rowCount: parsedData.length,
      detectedColumns: {
        month: monthKey,
        revenue: revenueKey,
        users: usersKey,
        orders: ordersKey
      }
    });

    setStatus(`✅ ${parsedData.length} rows imported! Redirecting to dashboard...`);
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Import Data</h2>
      <p style={{ color: '#64748b', marginBottom: '28px' }}>Upload any CSV file with sales data</p>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '32px', border: '2px dashed #334155', textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📥</p>
        <p style={{ color: '#94a3b8', marginBottom: '8px' }}>Upload your CSV file</p>
        <p style={{ color: '#475569', fontSize: '12px', marginBottom: '16px' }}>
          Supported columns: month, revenue, users, orders, category (any of these)
        </p>
        <input type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} id="fileInput" />
        <label htmlFor="fileInput" style={{
          background: '#0ea5e9', color: '#fff', padding: '10px 24px',
          borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500'
        }}>Choose CSV File</label>
        {fileName && <p style={{ color: '#38bdf8', marginTop: '12px', fontSize: '14px' }}>📎 {fileName}</p>}
      </div>

      {status && <p style={{ color: '#34d399', marginBottom: '16px', fontSize: '14px' }}>{status}</p>}

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
          fontSize: '14px', fontWeight: '600', marginBottom: '24px'
        }}>🚀 Import & Update Dashboard</button>
      )}

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
        <h3 style={{ color: '#e2e8f0', marginBottom: '12px' }}>📋 Supported CSV Formats</h3>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>Your CSV can have any of these column names:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          {[
            ['Month column', 'month, period, date, time'],
            ['Revenue column', 'revenue, sales, income, earnings'],
            ['Users column', 'users, customers, clients, visitors'],
            ['Orders column', 'orders, transactions, purchases'],
          ].map(([label, values]) => (
            <div key={label} style={{ background: '#0f172a', borderRadius: '8px', padding: '12px' }}>
              <p style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{label}</p>
              <p style={{ color: '#64748b', fontSize: '12px' }}>{values}</p>
            </div>
          ))}
        </div>
        <button onClick={() => {
          const csv = `month,revenue,users,orders\nJan,42000,120,168\nFeb,55000,180,251\nMar,48000,160,224\nApr,61000,210,294\nMay,70000,250,350\nJun,65000,230,322\nJul,80000,300,420\nAug,75000,280,392\nSep,90000,340,476\nOct,85000,310,434\nNov,95000,370,518\nDec,102000,400,560`;
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'sample_data.csv';
          a.click();
        }} style={{
          background: '#334155', color: '#e2e8f0', border: 'none',
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '13px'
        }}>⬇️ Download Sample CSV</button>
      </div>
    </div>
  );
}