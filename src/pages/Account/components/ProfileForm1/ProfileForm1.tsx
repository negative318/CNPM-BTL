export default function ProfileForm1() {
  return (
    <form className="p-6 mx-auto space-y-6 bg-white rounded-lg border border-t-[#ccc]">
      <div className="flex flex-col items-center justify-center mb-14">
        <div className="text-sm font-medium text-[24px] text-gray-700">
          Public Profile
        </div>
        <div className="pt-2 text-sm text-gray-700">
          Add information about yourself to share on your profile.
        </div>
      </div>

      <div className="flex flex-col justify-center mb-14 px-0 py-6 border-t-[#ccc] border-t border-solid">
        <label
          htmlFor="information"
          className="mb-2 text-sm font-bold text-gray-700 "
        >
          Basic information:
        </label>
      </div>
      <div className="flex items-center justify-between gap-10 mb-3 ">
          <label
            htmlFor="full-name"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Full name:
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            id="full-name"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
      </div>
      <div className="flex items-center justify-between gap-10 mb-3">
          <label
            htmlFor="student-code"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Student code:
          </label>
          <input
          type="text"
          placeholder="Enter your student code"
            id="student-code"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center justify-between gap-10 mb-3">
          <label
            htmlFor="day-of-birth"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Day of birth:
          </label>
          <input
          type="text"
          placeholder="Enter your day of birth"
            id="day-of-birth"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center justify-between gap-10 mb-3">
          <label
            htmlFor="sex"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Sex:
          </label>
          <input
          type="text"
          placeholder="Enter your sex"
            id="sex"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
      </div>
      <div className="flex items-center justify-between gap-10 mb-3">
          <label
            htmlFor="phone-number"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Phone number:
          </label>
          <input
          type="text"
          placeholder="Enter your phone number"
            id="phone-number"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center justify-between gap-10 mb-3">
          <label
            htmlFor="role"
            className="text-sm font-medium text-gray-700 mb-2 whitespace-nowrap min-w-[120px]"
          >
            Role:
          </label>
          <input
            type="text"
          id="role"
          placeholder="Enter your role"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
    </form>
  );
}
