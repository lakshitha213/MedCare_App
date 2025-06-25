import React, { useState, useEffect } from 'react';
import './AddDoctors.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

const AddDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    doctorId: '',
    degree: '',
    email: '',
    password: '',
    photo: null
  });
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'list'
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'General & Primary Care',
    'Cardiology & Related',
    'Neurology & Psychology',
    'Musculoskeletal',
    'Hematology & Oncology',
    'Pulmonary & Chest',
    'Digestive System',
    'Endocrine & Metabolic',
    'Kidney & Urology',
    'Pediatrics & Related',
    "Women's Health",
    "Men's Health",
    'Eye & Vision',
    'Ear, Nose, Throat (ENT)',
    'Teeth & Mouth',
    'Skin & Hair',
    'Emergency & Critical Care',
    'Infection & Immunity',
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'photo' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('category', formData.category);
    form.append('doctorId', formData.doctorId);
    form.append('degree', formData.degree);
    form.append('email', formData.email);
    form.append('password', formData.password);
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    try {
      await axios.post('http://localhost:8082/api/doctors/add', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Optionally, fetch the updated doctor list here
      setFormData({
        name: '',
        category: '',
        doctorId: '',
        degree: '',
        email: '',
        password: '',
        photo: null
      });
      setActiveTab('list');
      // Optionally, show a success message
    } catch (error) {
      // Handle error (show error message)
      console.error('Error adding doctor:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/api/doctors/delete/${id}`);
      setDoctors(doctors.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8082/api/doctors/all')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Doctor Management</h3>
        </div>
        <nav>
          <button 
            className={`sidebar-button ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Doctor
          </button>
          <button 
            className={`sidebar-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Doctor List
          </button>
        </nav>
        <button 
          className="logout-button"
          onClick={() => navigate('/')}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'add' ? (
          <div className="add-doctor-form">
            <h1>Add New Doctor</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="doctorId">Doctor ID</label>
                <input
                  type="text"
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="degree">Degree</label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo">Upload a Profile Photo</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="add-button">ADD DOCTOR</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="doctor-list-section">
            <h1>Doctor List</h1>
            <div className="form-group" style={{ maxWidth: 300, marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Search by name or category"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            <div className="doctor-list">
              {doctors.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.category.toLowerCase().includes(searchTerm.toLowerCase())
              ).length > 0 ? (
                doctors.filter(doctor =>
                  doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  doctor.category.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((doctor, index) => (
                  <div key={index} className="doctor-card">
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p><strong>Category:</strong> {doctor.category}</p>
                      <p><strong>ID:</strong> {doctor.doctorId}</p>
                      <p><strong>Degree:</strong> {doctor.degree}</p>
                      <p><strong>Email:</strong> {doctor.email}</p>
                      <button className="delete-button" onClick={() => handleDelete(doctor.id)}>Delete</button>
                    </div>
                    {doctor.photo && (
                      <div className="doctor-photo">
                        <img 
                          src={doctor.photo} 
                          alt={`${doctor.name}'s profile`}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-doctors">No doctors found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDoctors;