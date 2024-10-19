export default function ProfileForm() {
  return (
    <form className="p-6 mx-auto space-y-6 bg-white rounded-lg border border-t-[#ccc]">
      <div className="flex flex-col items-center justify-center mb-14">
        <div className="text-sm font-medium text-[24px] text-gray-700">
          Account
        </div>
        <div className="pt-2 text-sm text-gray-700">
          Edit your account settings and change your password here.
        </div>
      </div>
      <div className="flex flex-col justify-center mb-14 px-0 py-6 border-t-[#ccc] border-t border-solid">
        <label
          htmlFor="email"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          Email address*
        </label>
        <input
          type="email"
          id="email"
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col justify-center mb-14 px-0 py-4 border-t-[#ccc] border-t border-solid">
        <div className="mt-10 mb-6 text-sm font-medium text-gray-700">
          Password*
        </div>
        <div className="flex items-center justify-between gap-10 mb-3 ">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Current Password*
          </label>
          <input
            type="email"
            id="email"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center justify-between gap-10 mb-3">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            New Password*
          </label>
          <input
            type="email"
            id="email"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center justify-between gap-10 mb-3">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Retype Password*
          </label>
          <input
            type="email"
            id="email"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div >
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 ml-auto text-white bg-blue-500 rounded-md" 
        >
        Confirm
        </button>
      </div>
      <div className="flex flex-col justify-center mb-14 px-0 py-5 border-t-[#ccc] border-t border-solid">
        <div className="text-sm font-medium text-gray-700">
          SSO Authentication
        </div>
        <div className="text-sm text-gray-700 pt-2 text-[blue]">
          Edit your account settings and change your password here.
        </div>
        <div className = "flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 mt-10 text-white bg-blue-500 rounded-md w-fit"
        >
          Enable
          </button>
        </div>
      </div>
    </form>
  );
}
