import { useState } from "react";

export default function HomePageAfterLogin() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Thông báo về bảo trì máy in tòa nhà H6",
      date: "30 tháng 02 năm 2024",
      description: "Từ ngày 30 tháng 02 năm 2024, máy in tòa nhà H6 ngừng hoạt động.",
    },
  ]);

  const [newNotification, setNewNotification] = useState({ title: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNotification = () => {
    if (newNotification.title.trim() && newNotification.description.trim()) {
      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          title: newNotification.title,
          date: new Date().toLocaleDateString("vi-VN"),
          description: newNotification.description,
        },
      ]);
      setNewNotification({ title: "", description: "" });
      setIsAdding(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Banner */}
      <div className="relative w-full h-64 mb-8">
        <img
          src="/public/images/banner.jpg"
          alt="Banner"
          className="object-cover w-full h-full rounded-lg"
        />
      </div>

      {/* Notifications Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Thông báo người dùng</h3>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={() => setIsAdding(true)}
          >
            Thêm thông báo
          </button>
        </div>

        {isAdding && (
          <div className="p-4 mb-4 bg-gray-100 rounded-lg shadow">
            <h4 className="mb-2 text-lg font-bold text-gray-800">Thêm thông báo mới</h4>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Tiêu đề</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Nội dung</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newNotification.description}
                onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={handleAddNotification}
              >
                Lưu
              </button>
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setIsAdding(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-center w-12 h-12 mr-4 text-white bg-blue-500 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1 4v4m0-4a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{notification.title}</h4>
                <p className="text-gray-600">{notification.date}</p>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
