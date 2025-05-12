import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/data`)

        .then(res => {
          setData(res.data.data);
          setAlerts(res.data.alerts);
        })
        .catch(err => console.error(err));
    };

    fetchData(); // load once on page load

    const interval = setInterval(fetchData, 600000); // every 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#121212',
      color: 'white',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        paddingTop: '40px'
      }}>
        <h2>📦 Warehouse Package Monitoring System</h2>

        {alerts.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <strong>⚠️ KPI Alerts:</strong>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {alerts.map((alert, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: alert.level === 'critical' ? '#ff1744' : '#ffa000',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                  {alert.level === 'critical' ? '🚨' : '⚠️'} {alert.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <LineChart data={data} width={800} height={400}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="time" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none', color: '#fff' }} />
          <Legend />
          <Line type="monotone" dataKey="PACK_AFE" stroke="#00e5ff" strokeWidth={2} />
          <Line type="monotone" dataKey="PACK_SMALL" stroke="#ffea00" strokeWidth={2} />
          <Line type="monotone" dataKey="PACK_MIX" stroke="#ff6d00" strokeWidth={2} />
          <Line type="monotone" dataKey="SMART_PACK" stroke="#f50057" strokeWidth={2} />
        </LineChart>
      </div>
    </div>
  );
}

export default App;
