import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Import() {
  const [preview, setPreview] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setHeaders(Object.keys(result.data[0] || {}));
        setPreview(result.data.slice(0, 5));
        setStatus('✅ File parsed successfully. Preview below.');
      }
    });
  };

  const handleUpload = async () => {
    if (!preview.length) return;
    try {
      await axios.post(`${API}/api/data/import`, { headers, rows: preview });
      setStatus('✅ Data imported to database successfully!');
    } catch {
      setStatus('⚠️ Backend not connected. Data preview still works!');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>Import Data</h2>
      <p style={{ color: '#64748b', marginBottom: '28px' }}>Upload CSV files to import data into the dashboard</p>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '32px', border: '2px dashed #334155', textAlign: 'center', marginBottom: '24px' }}>
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📥</p>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>Drop your CSV file here or click to browse</p>
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
              <tr>{headers.map(h => <th key={h} style={{ padding: '8px 12px', color: '#64748b', borderBottom: '1px solid #334155', textAlign: 'left' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {headers.map(h => <td key={h} style={{ padding: '8px 12px', color: '#cbd5e1', borderBottom: '1px solid #1e293b' }}>{row[h]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {preview.length > 0 && (
        <button onClick={handleUpload} style={{
          background: '#0ea5e9', color: '#fff', border: 'none',
          padding: '12px 28px', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600'
        }}>Import to Database</button>
      )}
    </div>
  );
}