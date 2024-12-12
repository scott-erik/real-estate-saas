import React, { useState } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
function OpenHouseForm() {
  const [data, setData] = useState({ address: '', description: '' });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // Debug the token
  
    try {
      const res = await axios.post(`${API_URL}/api/openhouses`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Response:', res.data);
      alert('Open house created successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Error creating open house:', err.response?.data?.message || err.message);
      alert(`Error: ${err.response?.data?.message || 'Failed to create open house'}`);
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Open House</h2>
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={data.address}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={data.description}
        onChange={handleChange}
        required
      />
      <button type="submit">Create</button>
    </form>
  );
}

export default OpenHouseForm;
