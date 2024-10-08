import { faEnvelope, faPhone, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MainFooter() {
  return (
    <div className="mt-10 bg-blue-200 border-none">
      <div className="container flex items-center justify-between p-8 mx-auto">

        <div className="w-1/2">
          <div className="text-3xl font-bold">Smart Printing Service</div>
          <div className="mt-4 text-lg">Customer service shouldn't just</div>
          <div className="text-lg">be a department, it should be</div>
          <div className="text-lg">the entire company</div>
        </div>

        <div className="w-1/2">
          <div className="text-2xl font-bold">Contact Us</div>
          <div className="flex items-center mt-4">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            <span>Khu phố Tân Lập, Phường Đông Hòa, TP. Dĩ An, Tỉnh Bình Dương</span>
          </div>
          <div className="flex items-center mt-4">
            <FontAwesomeIcon icon={faPhone} className="mr-2" />
            <span>0123456789</span>
          </div>
          <div className="flex items-center mt-4">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            <span>dotiendung1234567891@gmail.com</span>
          </div>
        </div>
      </div>
      <div className='bg-mainBg border-t-[0.1px] border-y-black shrink-0 flex flex-col justify-between'>
         <div className='w-full p-2 text-xs text-center text-gray-400 bg-slate-700'>Copyright 2024 © CNPM</div>
       </div>
    </div>
  );
}


