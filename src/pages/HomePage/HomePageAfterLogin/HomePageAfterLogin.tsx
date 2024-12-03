export default function HomePageAfterLogin() {
  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Banner */}
      <div className="relative w-full h-64 mb-8">
        <img
          src="/public/images/banner.jpg"
          alt="Banner"
          className="object-cover w-full h-full rounded-lg"
        />
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-40">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold text-white">
              Thông báo người dùng
            </h2>
            <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              Xem
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Thông báo người dùng</h3>
          <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Thêm thông báo
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
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
              <h4 className="font-bold text-gray-800">
                Thông báo về bảo trì máy in tòa nhà H6
              </h4>
              <p className="text-gray-600">SPSO Số 212 - ngày 30 tháng 02 năm 2024</p>
              <p className="text-sm text-gray-500">
                Từ ngày 30 tháng 02 năm 2024, máy in tòa nhà H6 ngừng hoạt động.
              </p>
            </div>
          </div>

          {/* Placeholder for additional notifications */}
          <div className="h-24 p-4 bg-gray-200 rounded-lg"></div>
          <div className="h-24 p-4 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
