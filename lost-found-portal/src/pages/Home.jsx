import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContactModal from '../components/ContactModal';

// Helper to decode JWT and get userId
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteDescription, setDeleteDescription] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    category: '',
    image: null
  });

  const token = localStorage.getItem('token');
  const userId = token ? parseJwt(token)?.userId : null;

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!modalImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImage]);

  useEffect(() => {
    if (!showEditModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowEditModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEditModal]);

  const handleContactClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const goToChat = () => {
    window.location.href = '/chat';
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
    setDeleteReason('');
    setDeleteDescription('');
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    if (!deleteReason) {
      alert('Please select a reason for deletion.');
      return;
    }
    if (deleteReason === 'other' && !deleteDescription.trim()) {
      alert('Please provide a description for the deletion reason.');
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/items/${itemToDelete._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ reason: deleteReason, description: deleteDescription })
    });

    if (res.ok) {
      setItems(items.filter(item => item._id !== itemToDelete._id));
      alert('Item deleted!');
      closeDeleteModal();
    } else {
      alert('Failed to delete item');
      closeDeleteModal();
    }
  };

  const handleImageClick = (imagePath) => {
    setModalImage(imagePath);
  };

  const closeModal = () => setModalImage(null);

  // Edit logic
  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      contactEmail: item.contactEmail,
      contactPhone: item.contactPhone,
      category: item.category,
      image: null
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm({
      ...editForm,
      [name]: files ? files[0] : value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', editForm.title);
    data.append('description', editForm.description);
    data.append('contactEmail', editForm.contactEmail);
    data.append('contactPhone', editForm.contactPhone);
    data.append('category', editForm.category);
    if (editForm.image) data.append('image', editForm.image);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/items/${editItem._id}`, {
        method: 'PUT',
        headers: token ? { 'Authorization': 'Bearer ' + token } : {},
        body: data
      });
      if (res.ok) {
        const updated = await res.json();
        setItems(items.map(i => i._id === updated._id ? updated : i));
        setShowEditModal(false);
        setEditItem(null);
        alert('Item updated!');
      } else {
        alert('Failed to update item');
      }
    } catch (err) {
      alert('Error updating item');
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="text-center my-4">
        <Link to="/report" className="btn btn-success btn-lg">Report Item</Link>
      </div>

      <div className="container">
        <div className="input-group mb-4" style={{ maxWidth: 600, margin: '0 auto' }}>
          <input 
            type="text" 
            id="searchInput" 
            className="form-control" 
            placeholder="Search items..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          filteredItems.length > 0 ? (
            <div className="row g-4">
              {filteredItems.map(item => (
                <div className="col-md-4" key={item._id}>
                  <div className="item-card">
                    <img
                      src={item.image.startsWith('/uploads') ? item.image : `/uploads/${item.image}`}
                      alt={item.title}
                      style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => handleImageClick(item.image.startsWith('/uploads') ? item.image : `/uploads/${item.image}`)}
                    />
                    <h5>{item.title}</h5>
                    <p>📍 {item.location}</p>
                    <span className={`tag ${item.category === 'lost' ? 'lost' : 'found'}`}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                    <div className="mt-2">
                      <strong>Description:</strong> {item.description}
                    </div>

                    {token ? (
                      <>
                        <div className="mt-2">
                          <strong>Contact Email:</strong> {item.contactEmail}
                        </div>
                        <div className="mt-2">
                          <strong>Contact Phone:</strong> {item.contactPhone}
                        </div>
                      </>
                    ) : (
                       <div className="mt-2">
                          <strong>Contact Details:</strong> <Link to="/login">Login to view</Link>
                        </div>
                    )}

                    <div className="item-actions mt-3">
                      {token ? (
                        <>
                          <button className="contact-btn" onClick={handleContactClick}>Contact</button>
                          <button className="chat-btn" onClick={goToChat}>Chat</button>
                        </>
                      ): (
                         <Link to="/login" className="btn btn-primary">Login to Contact</Link>
                      )}
                      {(userId && (item.reportedBy?._id === userId || item.reportedBy === userId)) && (
                        <>
                          <button className="btn btn-warning ms-2" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn btn-danger ms-2" onClick={() => openDeleteModal(item)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h3>No Items Found</h3>
              <p>Try searching for something else.</p>
            </div>
          )
        )}
      </div>

      <section className="mt-5 container">
        <h2>About This Portal</h2>
        <p>This platform is created to help students recover their lost items and return found ones.</p>
        <blockquote className="blockquote">"The campus is a small world where we help each other."</blockquote>
      </section>

      <section className="mt-4 container">
        <h3>Steps to Report Lost Item</h3>
        <ol>
          <li>Login to your account</li>
          <li>Click on 'Report Item'</li>
          <li>Fill in item details and submit</li>
        </ol>
        <div className="text-center mt-3">
          <Link to="/report" className="btn btn-success btn-lg">Report Item</Link>
        </div>
      </section>

      <section className="mt-4 container">
        <h3>Commonly Lost Items</h3>
        <ul>
          <li>Wallets</li>
          <li>Phones</li>
          <li>ID Cards</li>
          <li>Chargers</li>
        </ul>
      </section>

      <section className="mt-4 container mb-5">
        <h3>Lost & Found Summary</h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Black Wallet</td>
                <td>Lost</td>
                <td>Cafeteria</td>
              </tr>
              <tr>
                <td>iPhone</td>
                <td>Found</td>
                <td>Library</td>
              </tr>
              <tr>
                <td>Earbuds</td>
                <td>Found</td>
                <td>Ground</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="text-center bg-dark text-white py-3">
        dmn7146@gmail.com
      </footer>

      <ContactModal show={showModal} onClose={handleCloseModal} />

      {modalImage && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={closeModal}
        >
          <img
            src={modalImage}
            alt="Full Size"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: '12px',
              boxShadow: '0 0 20px #000'
            }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001
          }}
          onClick={closeDeleteModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 16,
              minWidth: 320,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 0 20px #000',
              color: '#000'
            }}
          >
            <h4 className="mb-3">Confirm Deletion</h4>
            <p>Please tell us why you are deleting this item:</p>
            <div className="mb-3">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="reasonFound"
                  name="deleteReason"
                  value="found"
                  onChange={e => setDeleteReason(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reasonFound">The item has been found/returned.</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="reasonOther"
                  name="deleteReason"
                  value="other"
                  onChange={e => setDeleteReason(e.target.value)}
                />
                <label className="form-check-label" htmlFor="reasonOther">Other reason.</label>
              </div>
            </div>
            {deleteReason === 'other' && (
              <div className="mb-3">
                <label htmlFor="deleteDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="deleteDescription"
                  rows="3"
                  value={deleteDescription}
                  onChange={e => setDeleteDescription(e.target.value)}
                  placeholder="Please specify why you are deleting this item."
                ></textarea>
              </div>
            )}
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={deleteReason === 'other' && !deleteDescription.trim()}>Delete Item</button>
              <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setShowEditModal(false)}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleEditSubmit}
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 16,
              minWidth: 320,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 0 20px #000',
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: '24px 0',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <h4 className="mb-3">Edit Item</h4>
            <div className="mb-3">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                required
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-control"
                name="contactEmail"
                value={editForm.contactEmail}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                className="form-control"
                name="contactPhone"
                value={editForm.contactPhone}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Replace Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                accept="image/*"
                onChange={handleEditChange}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-secondary mt-2" onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        form::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Home; 