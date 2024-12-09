import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import VisitorForm from './components/Form/VisitorForm';
import ManageVisitors from './pages/ManageVisitors'; // Import the ManageVisitors page
import TemplateEditor from './components/TemplateEditor';
import TemplateView from './pages/TemplateView';
function App() {
  return (
    <Routes>
      {/* Existing Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/form/:id" element={<VisitorForm />} />
      <Route path="/openhouses/:id/template" element={<TemplateEditor />} />
      <Route path="/templates/:id" element={<TemplateView />} />
      {/* New Route for Managing Visitors */}
      <Route path="/openhouses/:id/visitors" element={<ManageVisitors />} />
    </Routes>
  );
}

export default App;
