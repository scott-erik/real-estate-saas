import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

function ManageVisitors() {
  const { id: openHouseId } = useParams();
  const [visitors, setVisitors] = useState([]);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feedback: '',
  });

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

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Edit Visitor
  const handleEdit = (visitor) => {
    setEditingVisitor(visitor._id);
    setFormData({
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone || '',
      feedback: visitor.feedback || '',
    });
  };

  // Save Visitor Updates
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/visitors/${editingVisitor}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Visitor updated successfully!');
      setEditingVisitor(null);
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

  // Export Visitors
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/visitors/${openHouseId}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob', // To handle file download
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'visitors.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting visitors:', err.message);
      alert('Failed to export visitors.');
    }
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Manage Visitors</h2>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg mb-4"
        >
          Export Visitors
        </button>

        {visitors.length === 0 ? (
          <p className="text-gray-300">No visitors found for this Open House.</p>
        ) : (
          <ul>
            {visitors.map((visitor) => (
              <li
                key={visitor._id}
                className="bg-gray-700 p-4 rounded-lg shadow-md mb-4"
              >
                {editingVisitor === visitor._id ? (
                  // Edit Form
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full mb-2 px-4 py-2 rounded-lg bg-gray-600 text-white"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full mb-2 px-4 py-2 rounded-lg bg-gray-600 text-white"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full mb-2 px-4 py-2 rounded-lg bg-gray-600 text-white"
                    />
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      placeholder="Feedback"
                      className="w-full mb-2 px-4 py-2 rounded-lg bg-gray-600 text-white"
                    />
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingVisitor(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <p><strong>Name:</strong> {visitor.name}</p>
                    <p><strong>Email:</strong> {visitor.email}</p>
                    <p><strong>Phone:</strong> {visitor.phone || 'N/A'}</p>
                    <p><strong>Feedback:</strong> {visitor.feedback || 'N/A'}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => handleEdit(visitor)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(visitor._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default ManageVisitors;
