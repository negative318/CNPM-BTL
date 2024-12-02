// import { useState } from "react";

import { useState } from "react";

export default function ProfileSideBar() {
  // const [activeIndex, setActiveIndex] = useState(-1);
  const [sidebarItems,setSidebarItems] = useState(['ProfileDuy','Account Setting','Printing Log','Logout']);
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/avatar-anh-meo-cute-1.jpg"
        alt="User Avatar"
        className="w-32 h-32 mb-4 rounded-full"
      />
      <h2 className="text-lg font-bold">John Doe</h2>
      <div className="left-1/2 z-10 mt-5 flex max-w-max min-w-[250px]">
        <div className="flex-auto max-w-md overflow-hidden text-sm leading-6 rounded-3xl">
          <div className="p-2">
            {sidebarItems.map((item, index: number) => {
              return (
                <div className="relative flex p-4 rounded-lg cursor-pointer group gap-x-6 hover:bg-gray-50" key={index}>
                  <div className={`font-semibold text-gray-900`} onClick={() => { }}>{item}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
