import { NavLink } from "react-router-dom";

export default function HomePageBeforeLogin() {
    return (
      <div className="container flex items-center justify-center">
    <div className="flex flex-col items-center justify-center h-screen"> 
      <div className="flex items-center p-10">

        <div className="w-1/2 text-left">
          <h1 className="font-bold text-orange-500 uppercase text-md">Welcome to TD</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-800">
            We are a smart printing service system
          </h2>
          <div className="mt-4 text-gray-500">
            Customer service shouldn't just be a department, it should be the entire company.
          </div>

          <div className="mt-8 space-x-4">
            <NavLink to="#" className="px-6 py-3 font-semibold text-white bg-orange-400 rounded-full hover:bg-orange-500">
              Experience now
            </NavLink>
            <NavLink to="#" className="px-6 py-3 font-semibold text-orange-400 border border-orange-400 rounded-full hover:bg-orange-50">
              Contact
            </NavLink>
          </div>
        </div>

        <div className="flex justify-center w-1/2">
          <img src="/public/images/001.jpg" alt="Smart Printer" className="h-auto border rounded-lg w-80" />
          </div>
      </div>
    </div>
  </div>
    );
  }
  