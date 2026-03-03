import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import NoNotificationImage from "../../assets/no-notifications.png";
import API from "../../api/api";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Arapey:ital@0;1&display=swap');

  .notif-drawer {
    position: fixed;
    top: 0; right: 0;
    height: 100%;
    width: 380px;
    max-width: 92%;
    background: #D5D4D3;
    box-shadow: -6px 0 32px rgba(97,109,107,0.18);
    z-index: 1050;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    font-family: 'Bricolage Grotesque', sans-serif;
  }

  .notif-drawer.open  { transform: translateX(0); }
  .notif-drawer.close { transform: translateX(100%); }

  /* Header */
  .notif-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px 16px;
    border-bottom: 1px solid #b8bcbb;
    background: #dddddc;
    flex-shrink: 0;
  }

  .notif-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .notif-title {
    font-family: 'Arapey', serif;
    font-style: italic;
    font-size: 1.35rem;
    font-weight: 400;
    color: #616D6B;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .notif-badge {
    background: #616D6B;
    color: #fff;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    border-radius: 20px;
    padding: 2px 9px;
    min-width: 24px;
    text-align: center;
    line-height: 1.6;
  }

  .notif-header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .notif-clear-btn {
    background: none;
    border: none;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: #4e5954;
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 6px;
    transition: background 0.18s, color 0.18s;
    letter-spacing: 0.03em;
  }
  .notif-clear-btn:hover {
    background: rgba(97,109,107,0.12);
    color: #616D6B;
  }

  .notif-close-btn {
    background: rgba(97,109,107,0.10);
    border: 1px solid #b8bcbb;
    border-radius: 7px;
    width: 32px; height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #4e5954;
    transition: background 0.18s, color 0.18s;
  }
  .notif-close-btn:hover {
    background: #616D6B;
    color: #fff;
    border-color: #616D6B;
  }

  /* Body */
  .notif-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    scrollbar-width: thin;
    scrollbar-color: #b8bcbb transparent;
  }
  .notif-body::-webkit-scrollbar { width: 4px; }
  .notif-body::-webkit-scrollbar-thumb { background: #b8bcbb; border-radius: 4px; }

  /* Card */
  .notif-card {
    background: #dddddc;
    border-radius: 10px;
    border: 1px solid #c8cac9;
    padding: 13px 14px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 10px;
    cursor: pointer;
    transition: box-shadow 0.18s, transform 0.15s, background 0.18s;
    position: relative;
    animation: notif-pop 0.22s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes notif-pop {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .notif-card:hover {
    box-shadow: 0 4px 16px rgba(97,109,107,0.14);
    transform: translateY(-1px);
    background: #d5d4d3;
  }
  .notif-card:last-child { margin-bottom: 0; }

  .notif-img {
    width: 46px; height: 46px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid #b8bcbb;
  }

  .notif-content { flex: 1; min-width: 0; }

  .notif-card-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #2d2a2a;
    margin: 0 0 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .notif-card-body {
    font-size: 0.78rem;
    color: #4e5954;
    margin: 0 0 5px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .notif-card-time {
    font-size: 0.68rem;
    color: #7a8280;
    font-weight: 500;
  }

  .notif-remove-btn {
    background: none;
    border: 1px solid #c8cac9;
    border-radius: 6px;
    width: 26px; height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #7a8280;
    flex-shrink: 0;
    transition: background 0.18s, color 0.18s, border-color 0.18s;
  }
  .notif-remove-btn:hover {
    background: #616D6B;
    color: #fff;
    border-color: #616D6B;
  }

  /* Empty state */
  .notif-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px 20px;
    text-align: center;
    gap: 14px;
  }

  .notif-empty img {
    width: 140px;
    opacity: 0.55;
  }

  .notif-empty p {
    font-size: 0.9rem;
    font-weight: 600;
    color: #7a8280;
    margin: 0;
  }

  /* Overlay */
  .notif-overlay {
    position: fixed;
    inset: 0;
    background: rgba(30,30,30,0.18);
    z-index: 1049;
    transition: opacity 0.3s ease;
  }
  .notif-overlay.open  { opacity: 1; pointer-events: all; }
  .notif-overlay.close { opacity: 0; pointer-events: none; }
`;

if (typeof document !== "undefined" && !document.getElementById("notif-miltronix-styles")) {
  const t = document.createElement("style");
  t.id = "notif-miltronix-styles";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const Notifications = ({ show, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/customer/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(res.data.notifications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, []);

  const clearAllNotifications = () => setNotifications([]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`notif-overlay ${show ? "open" : "close"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`notif-drawer ${show ? "open" : "close"}`}>

        {/* Header */}
        <div className="notif-header">
          <div className="notif-header-left">
            <span className="notif-badge">{notifications.length}</span>
            <h5 className="notif-title">Notifications</h5>
          </div>
          <div className="notif-header-right">
            {notifications.length > 0 && (
              <button className="notif-clear-btn" onClick={clearAllNotifications}>
                Clear All
              </button>
            )}
            <button className="notif-close-btn" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="notif-body">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="notif-card"
                onClick={() => notification.link && window.open(notification.link, "_blank")}
              >
                {notification.imageUrl && (
                  <img
                    src={notification.imageUrl}
                    alt="Notification"
                    className="notif-img"
                  />
                )}

                <div className="notif-content">
                  <p className="notif-card-title">{notification.title}</p>
                  <p className="notif-card-body">{notification.body}</p>
                  <span className="notif-card-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>

                <button
                  className="notif-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification._id);
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            ))
          ) : (
            <div className="notif-empty">
              <img src={NoNotificationImage} alt="No notifications" />
              <p>No Notifications Yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
