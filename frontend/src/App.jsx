import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Import from './pages/Import';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/import" element={<Import />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;