import React from "react";
import { X, Bell } from "lucide-react";

const NotificationAlert = ({ notifications, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-5 rounded-2xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Bell className="mr-2 text-indigo-600" /> Notifications
        </h2>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div
                key={index}
                className="p-3 bg-gray-100 rounded-lg flex items-center justify-between"
              >
                <span className="text-sm text-gray-700">{notif.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationAlert;
