import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/globalsuperadmin.scss";

const SuperadminInviteCodes = () => {
  const [inviteCodes, setInviteCodes] = useState([]);
  const [activeTab, setActiveTab] = useState("inviteCodes");
  const [expiresInHours, setExpiresInHours] = useState(24);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all invite codes from the backend
  const fetchInviteCodes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/invitecodes");
      setInviteCodes(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load invite codes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInviteCodes();
  }, []);

  // Handle invite code generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/invitecodes", { expiresInHours });
      fetchInviteCodes();
    } catch (err) {
      console.error(err);
      setError("Failed to generate invite code.");
    }
  };

  // For logs tab, we assume codes that have been used or processed have a 'status' property
  const inviteCodesLogs = inviteCodes.filter((code) => code.status);

  return (
    <div className="superadmin-invite-page">
      <div className="superadmin-invite-main-box">
        <button className="superadmin-generate-btn" onClick={handleGenerate}>
          Generate Invite Code
        </button>
        <div className="superadmin-toggle-buttons">
          <button
            className={`superadmin-toggle-button ${activeTab === "inviteCodes" ? "active" : ""}`}
            onClick={() => setActiveTab("inviteCodes")}
          >
            Invite Codes
          </button>
          <button
            className={`superadmin-toggle-button ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => setActiveTab("logs")}
          >
            Logs
          </button>
        </div>

        <div className="superadmin-inner-box">
          {error && <p className="error">{error}</p>}
          {isLoading ? (
            <p>Loading invite codes...</p>
          ) : (
            <>
              {activeTab === "inviteCodes" && (
                <>
                  {inviteCodes.length > 0 ? (
                    inviteCodes.map((code) => (
                      <div key={code._id} className="superadmin-invite-tab">
                        <p className="invite-code">{code.code}</p>
                        <div className="superadmin-invite-details">
                          <p>Admin: {code.createdBy?.name || "Pending"}</p>
                          <p>ID: {code.createdBy?._id || "Pending"}</p>
                          <p>Email: {code.createdBy?.email || "Pending"}</p>
                          <p>Status: Pending Approval</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No invite codes generated</p>
                  )}
                </>
              )}

              {activeTab === "logs" && (
                <>
                  {inviteCodesLogs.length > 0 ? (
                    inviteCodesLogs.map((code) => (
                      <div
                        key={code._id}
                        className={`superadmin-invite-tab ${
                          code.status === "approved"
                            ? "approved"
                            : code.status === "declined"
                            ? "declined"
                            : ""
                        }`}
                      >
                        <p className="invite-code">{code.code}</p>
                        <div className="superadmin-invite-details">
                          <p>Admin: {code.createdBy?.name || "Unknown"}</p>
                          <p>ID: {code.createdBy?._id || "Unknown"}</p>
                          <p>Email: {code.createdBy?.email || "Unknown"}</p>
                          <p>Status: {code.status || "Pending"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No logs available</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperadminInviteCodes;
