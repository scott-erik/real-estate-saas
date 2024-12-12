import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function CustomizeVisitorForm() {
  const navigate = useNavigate();
  const { id: openHouseId } = useParams();
  const [customFields, setCustomFields] = useState([]);
  const [fieldName, setFieldName] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

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
  }, [openHouseId, API_URL]);

  const handleAddField = () => {
    if (fieldName.trim()) {
      setCustomFields([...customFields, fieldName.trim()]);
      setFieldName('');
    }
  };

  const handleSaveFields = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/openhouses/${openHouseId}/customfields`,
        { customFields },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Custom fields saved successfully!');
      navigate(`/openhouses/${openHouseId}/visitorform`);
    } catch (error) {
      console.error('Error saving custom fields:', error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-800 text-white rounded-lg shadow-md max-w-4xl">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center sm:text-left">
        Customize Visitor Form
      </h1>

      {/* Input and Add Button */}
      <div className="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Enter custom field name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddField}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
        >
          Add Field
        </button>
      </div>

      {/* Custom Fields List */}
      <ul className="list-disc pl-5 mb-6 space-y-2">
        {customFields.map((field, index) => (
          <li key={index} className="text-lg">{field}</li>
        ))}
      </ul>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleSaveFields}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition"
        >
          Save Fields
        </button>
        <button
          onClick={() => navigate(`/openhouses/${openHouseId}/visitorform`)}
          className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition"
        >
          Go to Visitor Form
        </button>
      </div>
    </div>
  );
}

export default CustomizeVisitorForm;
