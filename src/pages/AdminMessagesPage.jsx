// src/pages/AdminMessagesPage.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import MessageTile from "../components/MessageTile";
import OrderTile from "../components/OrderTile";
import InlineOrderDetails from "../components/InlineOrderDetails";
import InlineMessageDetails from "../components/InlineMessageDetails";
import InlineReplyMessage from "../components/InlineReplyMessage";
import MessagesSettings from "../components/MessagesSettings";
import { useUser } from "../context/UserContext";
import "../styles/globaladmin.scss";
import "../styles/adminmessagespage.scss";
import {
  MdInbox,
  MdStar,
  MdSend,
  MdDrafts,
  MdDelete,
  MdSettings,
} from "react-icons/md";

const AdminMessagesPage = () => {
  const { user } = useUser();
  const [activeTile, setActiveTile] = useState("Primary");
  const [primaryFilter, setPrimaryFilter] = useState("message");
  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [conversationReplies, setConversationReplies] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const BASE_API_URL = import.meta.env.VITE_API_URL;
        let url = `${BASE_API_URL}/messages/admin`;
        if (user && (user.role === "admin" || user.role === "superadmin")) {
          url = `${BASE_API_URL}/messages/admin?adminId=${user._id}`;
        }
        const response = await fetch(url, { credentials: "include" });
        const data = await response.json();
        const enriched = data.map((msg) => ({
          ...msg,
          isStarred: msg.isStarred || false,
          isDraft: msg.isDraft || false,
          isSent: msg.isSent || false,
          isDeleted: msg.isDeleted || false,
          label: msg.label || "message",
        }));
        setMessages(enriched);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (user) fetchMessages();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const BASE_API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${BASE_API_URL}/orders/all`, {
          credentials: "include",
        });
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  useEffect(() => {
    setConversationReplies([]);
    setShowReply(false);
  }, [selectedMessage]);

  const handleTileClick = (tile) => {
    setActiveTile(tile);
    if (tile === "Primary") {
      setPrimaryFilter("message");
    }
    setSelectedOrder(null);
    setSelectedMessage(null);
    setShowReply(false);
  };

  const toggleStar = async (messageId) => {
    const updatedMessages = messages.map((msg) => {
      if (msg._id === messageId) {
        const updatedMsg = { ...msg, isStarred: !msg.isStarred };
        const BASE_API_URL = import.meta.env.VITE_API_URL;
        fetch(`${BASE_API_URL}/messages/${messageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isStarred: updatedMsg.isStarred }),
        });
        return updatedMsg;
      }
      return msg;
    });
    setMessages(updatedMessages);
  };

  const deleteMessage = async (messageId) => {
    const updatedMessages = messages.map((msg) => {
      if (msg._id === messageId) {
        const updatedMsg = { ...msg, isDeleted: true };
        const BASE_API_URL = import.meta.env.VITE_API_URL;
        fetch(`${BASE_API_URL}/messages/${messageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isDeleted: true }),
        });
        return updatedMsg;
      }
      return msg;
    });
    setMessages(updatedMessages);
  };

  const deleteOrder = async (orderId) => {
    try {
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${BASE_API_URL}/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleMessageSent = (newMessage) => {
    setConversationReplies((prev) => [...prev, newMessage]);
    setMessages([newMessage, ...messages]);
    setShowReply(false);
  };

  let displayItems = [];
  if (activeTile === "Primary") {
    if (primaryFilter === "order") {
      displayItems = orders;
    } else {
      displayItems = messages.filter(
        (msg) =>
          !msg.isDeleted &&
          !msg.isDraft &&
          !msg.isSent &&
          !msg.isStarred &&
          msg.label === primaryFilter
      );
    }
  } else if (activeTile === "Starred") {
    displayItems = messages.filter((msg) => msg.isStarred && !msg.isDeleted);
  } else if (activeTile === "Sent") {
    displayItems = messages.filter((msg) => msg.isSent && !msg.isDeleted);
  } else if (activeTile === "Drafts") {
    displayItems = messages.filter((msg) => msg.isDraft && !msg.isDeleted);
  } else if (activeTile === "Deleted") {
    displayItems = messages.filter((msg) => msg.isDeleted);
  }

  return (
    <>
      <AdminNavbar />
      <div className="main-container">
        <div className="admin-container">
          <div className="admin-messages-page">
            <div className="admin-messages-container">
              <aside className="admin-sidebar">
                <ul className="sidebar-menu">
                  <li
                    className={`sidebar-item ${activeTile === "Primary" ? "active" : ""}`}
                    onClick={() => handleTileClick("Primary")}
                  >
                    <MdInbox size={20} />
                    <span>Primary</span>
                  </li>
                  <li
                    className={`sidebar-item ${activeTile === "Starred" ? "active" : ""}`}
                    onClick={() => handleTileClick("Starred")}
                  >
                    <MdStar size={20} />
                    <span>Starred</span>
                  </li>
                  <li
                    className={`sidebar-item ${activeTile === "Sent" ? "active" : ""}`}
                    onClick={() => handleTileClick("Sent")}
                  >
                    <MdSend size={20} />
                    <span>Sent</span>
                  </li>
                  <li
                    className={`sidebar-item ${activeTile === "Drafts" ? "active" : ""}`}
                    onClick={() => handleTileClick("Drafts")}
                  >
                    <MdDrafts size={20} />
                    <span>Drafts</span>
                  </li>
                  <li
                    className={`sidebar-item ${activeTile === "Deleted" ? "active" : ""}`}
                    onClick={() => handleTileClick("Deleted")}
                  >
                    <MdDelete size={20} />
                    <span>Deleted</span>
                  </li>
                  <li
                    className={`sidebar-item ${activeTile === "Settings" ? "active" : ""}`}
                    onClick={() => handleTileClick("Settings")}
                  >
                    <MdSettings size={20} />
                    <span>Settings</span>
                  </li>
                </ul>
              </aside>

              <main className="messages-content">
                {activeTile === "Primary" && (
                  <header className="admin-toggle-buttons">
                    <button
                      className={`admin-toggle-button ${primaryFilter === "message" ? "active" : ""}`}
                      onClick={() => setPrimaryFilter("message")}
                    >
                      Primary
                    </button>
                    <button
                      className={`admin-toggle-button ${primaryFilter === "order" ? "active" : ""}`}
                      onClick={() => setPrimaryFilter("order")}
                    >
                      Orders
                    </button>
                    <button
                      className={`admin-toggle-button ${primaryFilter === "issues" ? "active" : ""}`}
                      onClick={() => setPrimaryFilter("issues")}
                    >
                      Issues
                    </button>
                    <button
                      className={`admin-toggle-button ${primaryFilter === "promotions" ? "active" : ""}`}
                      onClick={() => setPrimaryFilter("promotions")}
                    >
                      Promotions
                    </button>
                  </header>
                )}
                {activeTile === "Settings" ? (
                  <MessagesSettings />
                ) : (
                  <section className="messages-list-container">
                    {primaryFilter === "order" && selectedOrder ? (
                      <div className="order-wrapper">
                        <InlineOrderDetails
                          order={selectedOrder}
                          onClose={() => setSelectedOrder(null)}
                        />
                      </div>
                    ) : selectedMessage ? (
                      <div className="conversation-container">
                        <div className="message-wrapper">
                          <InlineMessageDetails
                            message={selectedMessage}
                            onClose={() => {
                              setSelectedMessage(null);
                              setShowReply(false);
                            }}
                            onToggleStar={() => toggleStar(selectedMessage._id)}
                            onDelete={() => deleteMessage(selectedMessage._id)}
                            onReply={() => setShowReply(true)}
                          />
                        </div>
                        {conversationReplies.map((reply, index) => (
                          <div key={reply._id || index} className="reply-item">
                            <div className="reply-message-box">
                              <div className="reply-message-header">
                                <span className="reply-sender-name">
                                  {reply.senderId?.name || "You"}
                                </span>
                                <span className="reply-timestamp">
                                  {new Date(reply.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <div className="reply-message-body">{reply.body}</div>
                            </div>
                          </div>
                        ))}
                        {showReply && (
                          <div className="reply-form-container">
                            <InlineReplyMessage
                              parentMessage={selectedMessage}
                              onCancel={() => setShowReply(false)}
                              onMessageSent={handleMessageSent}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {displayItems.length > 0 &&
                          displayItems.map((item, index) => {
                            if (primaryFilter === "order") {
                              return (
                                <OrderTile
                                  key={item._id || index}
                                  order={item}
                                  onDelete={(orderId) => deleteOrder(orderId)}
                                  onClick={(order) => setSelectedOrder(order)}
                                />
                              );
                            } else {
                              const isOutgoing =
                                user &&
                                (!item.senderId ||
                                  item.senderId._id?.toString() === user._id.toString());
                              const displayName = isOutgoing
                                ? item.userId?.name || "Receiver Unknown"
                                : item.senderId?.name || "Sender Unknown";
                              const displayEmail = isOutgoing
                                ? item.userId?.email || ""
                                : item.senderId?.email || "";
                              const displayProfile = isOutgoing
                                ? item.userId?.profileImage || "/default-profile.png"
                                : item.senderId?.profileImage || "/default-profile.png";
                              return (
                                <div
                                  key={item._id || index}
                                  onClick={() => setSelectedMessage(item)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <MessageTile
                                    message={item}
                                    subject={item.subject}
                                    body={item.body}
                                    timestamp={item.timestamp}
                                    displayName={displayName}
                                    displayEmail={displayEmail}
                                    displayProfile={displayProfile}
                                    isOutgoing={isOutgoing}
                                    onToggleStar={(e) => {
                                      e.stopPropagation();
                                      toggleStar(item._id);
                                    }}
                                    onDelete={(e) => {
                                      e.stopPropagation();
                                      deleteMessage(item._id);
                                    }}
                                  />
                                </div>
                              );
                            }
                          })}
                        {displayItems.length === 0 && (
                          <div className="no-messages text-center">
                            No items available.
                          </div>
                        )}
                      </>
                    )}
                  </section>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMessagesPage;
