import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAlerts } from '../hooks/useAlerts';
import '../styles/adminlayout.scss'; 

const AdminLayout = ({ children }) => {
  // Only admin pages listen for alert events
  useAlerts();

  return (
    <div className="admin-layout">
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AdminLayout;
