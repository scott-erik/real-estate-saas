// frontend/src/pages/CustomizeVisitorForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function CustomizeVisitorForm() {
  const navigate = useNavigate();
  const { id: openHouseId } = useParams();
  const [customFields, setCustomFields] = useState([]);
  const [fieldName, setFieldName] = useState('');

  useEffect(() => {
    const fetchCustomFields = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/openhouses/${openHouseId}/customfields`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomFields(res.data.customFields || []);
      } catch (error) {
        console.error('Error fetching custom fields:', error.message);
      }
    };
    fetchCustomFields();
  }, [openHouseId]);

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
        `http://localhost:5000/api/openhouses/${openHouseId}/customfields`,
        { customFields },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Custom fields saved successfully!');
      navigate(`/openhouses/${openHouseId}/visitorform`); // Redirect to the VisitorForm
    } catch (error) {
      console.error('Error saving custom fields:', error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Customize Visitor Form</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter custom field name"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white mr-2"
        />
        <button
          onClick={handleAddField}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Add Field
        </button>
      </div>
      <ul className="list-disc pl-5 mb-4">
        {customFields.map((field, index) => (
          <li key={index} className="mb-2">{field}</li>
        ))}
      </ul>
      <div className="flex space-x-4">
        <button
          onClick={handleSaveFields}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
        >
          Save Fields
        </button>
        <button
          onClick={() => navigate(`/openhouses/${openHouseId}/visitorform`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
        >
          Go to Visitor Form
        </button>
      </div>
    </div>
  );
}

export default CustomizeVisitorForm;