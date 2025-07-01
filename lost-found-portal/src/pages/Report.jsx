import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    location: '',
    description: '',
    status: 'lost',
    image: null,
    contactEmail: '',
    contactPhone: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.itemName);
    data.append('category', formData.status); // 'lost' or 'found'
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('date', new Date().toISOString());
    if (formData.image) data.append('image', formData.image);
    data.append('contactEmail', formData.contactEmail);
    data.append('contactPhone', formData.contactPhone);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: token ? { 'Authorization': 'Bearer ' + token } : {},
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        alert('Report submitted!');
        navigate('/'); // Redirect to home page
      } else {
        alert(result.message || 'Failed to submit report');
      }
    } catch (err) {
      alert('Error submitting report');
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ 
      minHeight: '100vh', 
      background: 'aliceblue', 
      marginTop: '24px',
    }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 d-flex justify-content-center">
          <div className="card shadow" style={{ 
            maxWidth: '800px', 
            width: '100%', 
            padding: '32px 24px', 
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <div className="card-body p-0">
              <h2 className="text-center mb-4">Report Item</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="lost"
                      name="status"
                      value="lost"
                      checked={formData.status === 'lost'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="lost">Lost</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="found"
                      name="status"
                      value="found"
                      checked={formData.status === 'found'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="found">Found</label>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="itemName" className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                    <option value="documents">Documents</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="contactPhone" className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Submit Report</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report; 