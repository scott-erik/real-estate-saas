import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function VisitorForm() {
  const { id: openHouseId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    feedback: '',
  });
  const [openHouseAddress, setOpenHouseAddress] = useState(''); // State to hold the Open House address

  useEffect(() => {
    const fetchOpenHouseAddress = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/openhouses/${openHouseId}`);
        if (!res.ok) throw new Error('Failed to fetch Open House data');
        const data = await res.json();
        setOpenHouseAddress(data.address || 'Open House'); // Set address or fallback to "Open House"
      } catch (err) {
        console.error('Error fetching Open House:', err.message);
      }
    };

    fetchOpenHouseAddress();
  }, [openHouseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/visitors/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, openHouseId }),
      });
      if (!res.ok) throw new Error('Error submitting form.');
      alert('Form submitted successfully!');
    } catch (err) {
      console.error(err.message);
      alert('Failed to submit form.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* Dynamic Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Sign In for Open House: {openHouseAddress}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="feedback"
            placeholder="Feedback or Questions"
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold transition duration-300"
          >
            Submit
          </button>
        </form>

        {/* Placeholder Section for Real Estate Agents */}
        <div className="mt-8 p-4 bg-gray-700 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-blue-300 mb-2">
            Additional Information or Forms
          </h3>
          <p className="text-gray-300">
            This section can be customized by the real estate agent to include any additional
            information, documents, or links for visitors.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VisitorForm;
