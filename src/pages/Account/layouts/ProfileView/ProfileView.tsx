import ProfileSideBar from '../../components/ProfileSideBar'

export default function ProfileView() {
    return (
        <div className="flex justify-center min-h-[calc(100vh_-_64px_-_235px)]">
            <div className="flex w-[70vw]">
                <div className="px-0 py-10 bg-gray-200 w-3/10">
                 <ProfileSideBar />
                </div>
            </div>
    </div>
    );

}