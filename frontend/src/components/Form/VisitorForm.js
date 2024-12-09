import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VisitorForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', feedback: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/visitors/submit', { ...formData, openHouseId: id });
      alert('Form submitted!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
      <textarea name="feedback" placeholder="Feedback" onChange={handleChange}></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}

export default VisitorForm;
