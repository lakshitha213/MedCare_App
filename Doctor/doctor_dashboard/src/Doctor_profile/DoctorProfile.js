import React, { useEffect, useState } from 'react';
import './DoctorProfile.css';
import axios from 'axios';

const DoctorProfile = ({ doctor, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: doctor?.name || '',
    category: doctor?.category || '',
    degree: doctor?.degree || '',
    password: doctor?.password || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(doctor?.photo || '');

  useEffect(() => {
    if (doctor) {
      setLoading(false);
      setForm({
        name: doctor.name || '',
        category: doctor.category || '',
        degree: doctor.degree || '',
        password: doctor.password || ''
      });
      setImagePreview(doctor.photo || '');
    }
  }, [doctor]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('degree', form.degree);
      formData.append('password', form.password);
      if (imageFile) {
        formData.append('photo', imageFile);
      }
      await axios.put(`http://localhost:8082/api/doctors/update/${doctor.email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>No doctor found.</p>;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className="sidebar-header">
          <h3>Doctor Menu</h3>
        </div>
        <nav style={{ flex: 1 }}>
          <a
            href="#profile"
            className={`sidebar-link${activeTab === 'profile' ? ' active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </a>
          <a
            href="#appointments"
            className={`sidebar-link${activeTab === 'appointments' ? ' active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments
          </a>
        </nav>
        <button onClick={onLogout} style={{ marginBottom: 30, background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', width: '80%', alignSelf: 'center' }}>Logout</button>
      </div>
      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'profile' && (
          <div className="profile-content">
            {doctor.photo && <img src={doctor.photo} alt="Doctor" className="profile-image" />}
            <div className="profile-details">
              {editMode ? (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <label>Name: </label>
                    <input name="name" value={form.name} onChange={handleChange} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>Category: </label>
                    <input name="category" value={form.category} onChange={handleChange} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>Degree: </label>
                    <input name="degree" value={form.degree} onChange={handleChange} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>Password: </label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label>Profile Image: </label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="profile-image" style={{ marginBottom: 10 }} />
                  )}
                  <button onClick={handleSave} style={{ marginRight: 10, background: '#27ae60', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  <button onClick={handleCancel} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </>
              ) : (
                <>
                  <h2>{doctor.name}</h2>
                  <p><strong>Category:</strong> {doctor.category}</p>
                  <p><strong>Degree:</strong> {doctor.degree}</p>
                  <p><strong>Email:</strong> {doctor.email}</p>
                  <button onClick={handleEdit} style={{ background: '#3498db', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', marginTop: 10 }}>Edit</button>
                </>
              )}
            </div>
          </div>
        )}
        {activeTab === 'appointments' && <Appointments doctorName={doctor.name} />}
      </div>
    </div>
  );
};

const Appointments = ({ doctorName }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8082/api/channeling/doctor/${doctorName}`)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [doctorName]);

  // Filter appointments by patient name or date
  const filteredAppointments = appointments.filter(app => {
    const nameMatch = app.userName && app.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = app.date && app.date.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || dateMatch;
  });

  const handleApprove = (appointmentId) => {
    axios.put(`http://localhost:8082/api/channeling/approve/${appointmentId}`)
      .then(() => {
        setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status: 'approved' } : app));
      })
      .catch(() => alert('Failed to approve appointment.'));
  };

  const handleDelete = (appointmentId) => {
    if(window.confirm('Are you sure you want to delete this appointment?')) {
      axios.delete(`http://localhost:8082/api/channeling/delete/${appointmentId}`)
        .then(() => {
          setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        })
        .catch(() => alert('Failed to delete appointment.'));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!filteredAppointments.length) return <p>No appointments found.</p>;

  return (
    <div className="appointment-list-section">
      <h1>Appointment List</h1>
      <div className="form-group" style={{ maxWidth: 300, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by patient or date"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>
      <div className="appointment-list">
        {filteredAppointments.map((appointment, index) => (
            <div key={index} className="appointment-card">
              <div className="appointment-info">
                <h3>{appointment.userName}</h3>
                <div className="appointment-details-column">
                  <span><strong>Email:</strong> {appointment.userEmail}</span>
                  <span><strong>Telephone:</strong> {appointment.userTelephone}</span>
                  <span><strong>Date:</strong> {appointment.date}</span>
                  <span><strong>Time:</strong> {appointment.time}</span>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => handleApprove(appointment.id)}
                    style={{ marginRight: '10px', background: appointment.status === 'approved' ? '#aaa' : '#27ae60', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: appointment.status === 'approved' ? 'not-allowed' : 'pointer' }}
                    disabled={appointment.status === 'approved'}
                  >
                    {appointment.status === 'approved' ? 'Approved' : 'Approve'}
                  </button>
                  <button onClick={() => handleDelete(appointment.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
              {appointment.userProfileImage && (
                <div className="appointment-photo">
                  <img 
                    src={appointment.userProfileImage} 
                    alt={`${appointment.userName}'s profile`}
                  />
                </div>
              )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorProfile;
