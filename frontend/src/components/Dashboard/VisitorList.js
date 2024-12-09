import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VisitorList({ openHouseId }) {
  const [visitors, setVisitors] = useState([]);
  const [editVisitor, setEditVisitor] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', feedback: '' });

  // Fetch Visitors
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

  useEffect(() => {
    fetchVisitors();
  }, [openHouseId]);

  // Handle Edit Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Edit
  const handleEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/visitors/${editVisitor._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Visitor updated successfully!');
      setEditVisitor(null);
      fetchVisitors();
    } catch (err) {
      console.error('Error updating visitor:', err.message);
    }
  };

  // Delete Visitor
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

  return (
    <div>
      <h2>Visitor List</h2>
      {visitors.length === 0 ? (
        <p>No visitors yet.</p>
      ) : (
        <ul>
          {visitors.map((visitor) => (
            <li key={visitor._id}>
              <strong>Name:</strong> {visitor.name} <br />
              <strong>Email:</strong> {visitor.email} <br />
              <strong>Phone:</strong> {visitor.phone} <br />
              <strong>Feedback:</strong> {visitor.feedback} <br />
              <button onClick={() => setEditVisitor(visitor)}>Edit</button>
              <button onClick={() => handleDelete(visitor._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Form */}
      {editVisitor && (
        <div>
          <h3>Edit Visitor</h3>
          <input
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={editVisitor.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={editVisitor.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            defaultValue={editVisitor.phone}
            onChange={handleChange}
          />
          <textarea
            name="feedback"
            placeholder="Feedback"
            defaultValue={editVisitor.feedback}
            onChange={handleChange}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setEditVisitor(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default VisitorList;
