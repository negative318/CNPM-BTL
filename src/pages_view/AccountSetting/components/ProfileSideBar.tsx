export default function ProfileSideBar() {
  return (
    <div className="flex flex-col justify-center items-center">
      <img
        src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-1.jpg"
        alt="User Avatar"
        className="w-32 h-32 rounded-full mb-4"
      />
      <h2 className="text-lg font-bold">John Doe</h2>
      <div className="left-1/2 z-10 mt-5 flex max-w-max min-w-[250px]">
        <div className="max-w-md flex-auto overflow-hidden rounded-3xl text-sm leading-6">
          <div className="p-2">
            <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-semibold text-gray-900">Profile</div>
            </div>
            <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-semibold text-gray-900">Account Setting</div>
            </div>
            <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-semibold text-gray-900">Printing Log</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
