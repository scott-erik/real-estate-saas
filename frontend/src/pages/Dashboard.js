import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import OpenHouseList from '../components/Dashboard/OpenHouseList';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const navigate = useNavigate();
  const [openHouses, setOpenHouses] = useState([]); // Centralized state for Open Houses
  const [newOpenHouse, setNewOpenHouse] = useState({
    address: '',
    description: '',
  });

  // Fetch Open Houses
  const fetchOpenHouses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/openhouses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenHouses(res.data);
    } catch (error) {
      console.error('Error fetching Open Houses:', error.message);
    }
  };

  useEffect(() => {
    fetchOpenHouses();
  }, []);

  // Handle Form Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOpenHouse({ ...newOpenHouse, [name]: value });
  };

  // Create Open House
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/openhouses`, newOpenHouse, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Open House created successfully!');
      setOpenHouses((prev) => [...prev, res.data]); // Append new Open House to state
      setNewOpenHouse({ address: '', description: '' });
    } catch (err) {
      console.error('Error creating Open House:', err.message);
      alert('Failed to create Open House.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Layout>
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-400">
            Manage Your Open Houses
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Create Open House Form */}
        <form onSubmit={handleCreate} className="space-y-4 mb-8">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newOpenHouse.address}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newOpenHouse.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            Create Open House
          </button>
        </form>

        {/* Open Houses List */}
        <OpenHouseList openHouses={openHouses} setOpenHouses={setOpenHouses} />
      </div>
    </Layout>
  );
}

export default Dashboard;
