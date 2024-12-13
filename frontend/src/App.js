import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import VisitorForm from './components/Form/VisitorForm';
import ManageVisitors from './pages/ManageVisitors'; // Import the ManageVisitors page
import TemplateEditor from './components/TemplateEditor';
import TemplateView from './pages/TemplateView';
import LandingPage from './pages/LandingPage';
import CustomizeVisitorForm from './pages/CustomizeVisitorForm';

function App() {
  return (
    <Routes>
      {/* Updated Root Route to LandingPage */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Existing Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/form/:id" element={<VisitorForm />} /> */}
      <Route path="/openhouses/:id/template" element={<TemplateEditor />} />
      <Route path="/templates/:id" element={<TemplateView />} />
      <Route path="/openhouses/:id/visitors" element={<ManageVisitors />} />
      <Route path="/openhouses/:id/customize-visitor-form" element={<CustomizeVisitorForm />} />
      <Route path="/openhouses/:id/visitorform" element={<VisitorForm />} />

    </Routes>
  );
}

export default App;
