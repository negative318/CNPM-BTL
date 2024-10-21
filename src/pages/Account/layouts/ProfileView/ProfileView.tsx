import ProfileSideBar from '../../components/ProfileSideBar'
import ProfileForm1 from '../../components/ProfileForm1';

export default function ProfileView() {
    return (
        <div className="flex justify-center min-h-[calc(100vh_-_64px_-_235px)]">
            <div className="flex w-[70vw]">
                <div className="px-0 py-10 bg-gray-200 w-3/10">
                    <ProfileSideBar />
                </div>
                <div className="w-full p-4 bg-white w-7/10">
                    <ProfileForm1 />
                </div>
            </div>
    </div>
    );

}