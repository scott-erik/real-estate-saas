import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
function TemplateEditor() {
  const { id: openHouseId } = useParams();
  const [templateData, setTemplateData] = useState({
    contactInfo: '',
    companyLogo: null, // For file upload
    qrCodeLink: '',    // Added from second block
  });
  const navigate = useNavigate();

  // Fetch Existing Template Data
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/openhouses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const openHouse = res.data.find((house) => house._id === openHouseId);
        if (openHouse.template) {
          setTemplateData({
            contactInfo: openHouse.template.contactInfo || '',
            companyLogo: openHouse.template.companyLogo || '',
            qrCodeLink: openHouse.template.qrCodeLink || '', // Include qrCodeLink
          });
        }
      } catch (err) {
        console.error('Error fetching template data:', err.message);
      }
    };

    fetchTemplate();
  }, [openHouseId]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData({ ...templateData, [name]: value });
  };

  // Handle File Upload Change
  const handleFileChange = (e) => {
    setTemplateData({ ...templateData, companyLogo: e.target.files[0] });
  };

  // Save Template Data
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('contactInfo', templateData.contactInfo);
      if (templateData.companyLogo) {
        formData.append('companyLogo', templateData.companyLogo);
      }

      await axios.put(
        `${API_URL}/api/openhouses/${openHouseId}/template`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Template updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving template:', err.message);
      alert('Failed to save template.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">Customize Template</h2>
        <form onSubmit={handleSave} className="space-y-4">
          {/* Contact Information */}
          <label className="block">
            Contact Information:
            <textarea
              name="contactInfo"
              placeholder="Enter your contact information"
              value={templateData.contactInfo}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-700"
            />
          </label>

          {/* Company Logo Upload */}
          <label className="block">
            Company Logo:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 mt-2 bg-gray-700 text-white"
            />
          </label>

          {/* Display QR Code Link */}
          <label className="block">
            QR Code Link:
            <input
              type="text"
              name="qrCodeLink"
              value={templateData.qrCodeLink}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-600 text-gray-400"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg"
          >
            Save Template
          </button>
        </form>
      </div>
    </div>
  );
}

export default TemplateEditor;
