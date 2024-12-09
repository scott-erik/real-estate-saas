import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function TemplateEditor() {
  const { id: openHouseId } = useParams();
  const [templateData, setTemplateData] = useState({
    contactInfo: '',
    companyLogo: null, // For file upload
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData({ ...templateData, [name]: value });
  };

  const handleFileChange = (e) => {
    setTemplateData({ ...templateData, companyLogo: e.target.files[0] });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('contactInfo', templateData.contactInfo);
      if (templateData.companyLogo) {
        formData.append('companyLogo', templateData.companyLogo);
      }

      await axios.put(
        `http://localhost:5000/api/openhouses/${openHouseId}/template`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Template saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving template:', err.message);
      alert('Failed to save template.');
    }
  };

  return (
    <div>
      <h2>Customize Template</h2>
      <label>Contact Information:</label>
      <textarea
        name="contactInfo"
        value={templateData.contactInfo}
        onChange={handleChange}
        placeholder="Enter your contact information here"
      />

      <label>Company Logo:</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button onClick={handleSave}>Save Template</button>
    </div>
  );
}

export default TemplateEditor;
