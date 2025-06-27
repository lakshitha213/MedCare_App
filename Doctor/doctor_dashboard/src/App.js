import React, { useState, useEffect } from 'react';
import DoctorProfile from './Doctor_profile/DoctorProfile';
import axios from 'axios';
import './App.css';
import logo from './Assets/logo.png';

function App() {
  const [doctor, setDoctor] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('email', email);
      params.append('password', password);

      const res = await axios.post(
        'http://localhost:8082/api/doctors/login',
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      setDoctor(res.data);
      localStorage.setItem('doctor', JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Invalid email or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('doctor');
    setDoctor(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  if (!doctor) {
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: 100, margin: '0 auto 20px', display: 'block' }}
          />
          <h2>Doctor Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <DoctorProfile doctor={doctor} onLogout={handleLogout} />
    </div>
  );
}

export default App;
