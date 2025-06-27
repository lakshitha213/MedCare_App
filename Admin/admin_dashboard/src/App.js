import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import AddDoctors from './components/AddAdmin/AddDoctors';
import { useNavigate } from 'react-router';
import logo from './assets/logo.png';

// Placeholder Login component
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Admin12345') {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <img src={logo} alt="Logo" style={{ width: 100, marginBottom: 20 }} />
      <h2>Admin Login</h2>
      <form style={{ display: 'flex', flexDirection: 'column', width: 300 }} onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" style={{ marginBottom: 10, padding: 8 }} value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" style={{ marginBottom: 10, padding: 8 }} value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" style={{ padding: 10, background: '#3498db', color: 'white', border: 'none', borderRadius: 4 }}>Login</button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AddDoctors />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;