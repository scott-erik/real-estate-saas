import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ManageVisitors() {
  const { id: openHouseId } = useParams();
  const [visitors, setVisitors] = useState([]);
  const [editingVisitorId, setEditingVisitorId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feedback: '',
  });

  // Fetch visitors for the Open House
  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/visitors/${openHouseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(res.data);
    } catch (err) {
      console.error('Error fetching visitors:', err.message);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Edit visitor
  const handleEdit = (visitor) => {
    setEditingVisitorId(visitor._id);
    setFormData({
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      feedback: visitor.feedback,
    });
  };

  // Update visitor
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/visitors/${editingVisitorId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Visitor updated successfully!');
      setEditingVisitorId(null);
      fetchVisitors();
    } catch (err) {
      console.error('Error updating visitor:', err.message);
    }
  };

  // Delete visitor
  const handleDelete = async (visitorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/visitors/${visitorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Visitor deleted successfully!');
      fetchVisitors();
    } catch (err) {
      console.error('Error deleting visitor:', err.message);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [openHouseId]);

  return (
    <div>
      <h2>Manage Visitors</h2>

      {/* Visitor List */}
      <ul>
        {visitors.map((visitor) => (
          <li key={visitor._id}>
            {editingVisitorId === visitor._id ? (
              // Edit Form
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Feedback"
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingVisitorId(null)}>Cancel</button>
              </div>
            ) : (
              // Display Visitor Details
              <div>
                <strong>Name:</strong> {visitor.name} <br />
                <strong>Email:</strong> {visitor.email} <br />
                <strong>Phone:</strong> {visitor.phone} <br />
                <strong>Feedback:</strong> {visitor.feedback} <br />
                <button onClick={() => handleEdit(visitor)}>Edit</button>
                <button onClick={() => handleDelete(visitor._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageVisitors;
