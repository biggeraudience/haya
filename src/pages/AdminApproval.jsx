// src/pages/AdminApproval.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import "../styles/adminapproval.scss";

const AdminApproval = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPendingAdmins = async () => {
    setLoading(true);
    try {
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${BASE_API_URL}/admin/all`, {
        withCredentials: true,
      });
      const pending = response.data.filter(admin => !admin.isApproved);
      setPendingAdmins(pending);
    } catch (error) {
      console.error("Error fetching pending admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const handleApprove = async (adminId) => {
    try {
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.put(
        `${BASE_API_URL}/admin/approve/${adminId}`,
        {},
        { withCredentials: true }
      );
      alert(`Admin ${response.data.name} approved successfully!`);
      setPendingAdmins(prev => prev.filter(admin => admin._id !== adminId));
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve admin");
    }
  };

  return (
    <>
      <ProductNavbar />
      <div className="admin-approval-page">
        <h1>Admin Approval</h1>
        {loading ? (
          <p>Loading pending admins...</p>
        ) : pendingAdmins.length > 0 ? (
          <table className="approval-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAdmins.map(admin => (
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>
                    <button onClick={() => handleApprove(admin._id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending admin approvals.</p>
        )}
        <button onClick={() => navigate("/superadminpanel")}>
          Back to Superadmin Panel
        </button>
      </div>
      <ProductFooter />
    </>
  );
};

export default AdminApproval;
