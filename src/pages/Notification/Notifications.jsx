import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import NoNotificationImage from "../../assets/no-notifications.png";
import API from "../../api/api";
import "bootstrap/dist/css/bootstrap.min.css";

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
        console.log("res", res.data);
        setNotifications(res.data.notifications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, []);
  console.log(notifications);

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== id),
    );
  };

  return (
    <div
      className={`position-fixed top-0 end-0 bg-white shadow-lg h-100`}
      style={{
        width: "400px",
        maxWidth: "90%",
        transform: show ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease-in-out",
        zIndex: 1050,
      }}
    >
      <div className="d-flex flex-column h-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge bg-success rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "28px", height: "28px" }}
            >
              {notifications.length}
            </span>
            <h5 className="mb-0 fw-bold">Notifications</h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span
              className="text-muted fw-medium"
              style={{ cursor: "pointer" }}
              onClick={clearAllNotifications}
            >
              Clear All
            </span>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-grow-1 overflow-auto p-3">
          {notifications.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {notifications.map((notification) => (
                <div className="card shadow-sm mb-3" key={notification._id} style={{cursor:"pointer"}} onClick={() => window.open(notification.link, "_blank")}>
                  <div className="card-body d-flex justify-content-between">
                    <div className="d-flex gap-3 w-100">
                      {notification.imageUrl && (
                        <img
                          src={notification.imageUrl}
                          alt="Notification"
                          className="rounded"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold">{notification.title}</h6>
                        <p className="mb-1">{notification.body}</p>
                        <small className="text-muted">
                          {new Date(notification.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => removeNotification(notification._id)}
                      >
                        <X size={16} />
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted mt-4">
              <img
                src={NoNotificationImage}
                alt="No notifications"
                className="img-fluid mb-3"
              />
              <p className="fw-semibold">No Notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
