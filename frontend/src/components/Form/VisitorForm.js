import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
function VisitorForm() {
  const { id: openHouseId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feedback: '',
  });

  const [customFields, setCustomFields] = useState([]);

  // Fetch custom fields dynamically
  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${API_URL}/api/openhouses/${openHouseId}/customfields`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomFields(res.data.customFields || []);
      } catch (error) {
        console.error('Error fetching custom fields:', error.message);
      }
    };

    fetchCustomFields();
  }, [openHouseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/visitors/submit`, // Updated endpoint
        { openHouseId, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error.message);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Visitor Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Default Fields */}
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
        />
        <textarea
          placeholder="Feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
        ></textarea>

        {/* Custom Fields */}
        {customFields.map((field, index) => (
          <input
            key={index}
            type="text"
            placeholder={field}
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          />
        ))}

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default VisitorForm;
