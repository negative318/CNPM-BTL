import ProfileForm from "./components/ProfileForm";
import ProfileSideBar from "./components/ProfileSideBar";

export default function AccountSettingView() {
  return (
    <div className="flex justify-center min-h-[calc(100vh_-_64px_-_235px)]">
      <div className="flex w-[70vw]">
        <div className="w-3/10 bg-gray-200 px-0 py-10">
          <ProfileSideBar />
        </div>

        <div className="w-7/10 bg-white p-4 w-full">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
