import {faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MainFooter() {
  return (
    <div className='mt-10 bg-blue-100 border-none'>
      <div className='container flex gap-5 pt-10 pb-10 text-darkText'>
        <div className='w-7/12 h-full'>
            <div className='pb-10 text-3xl font-semibold pl-28'>Liên Hệ</div>
            <div className="flex items-center justify-center">
              <img className="w-4/6" src="https://i.ibb.co/DtMw32j/location.jpg" alt="" />
            </div>
          </div>
          <div className='inline-block w-5/12 h-full pt-20 '>
            <div className='flex'>
              <div className='items-center p-3 px-4 text-2xl font-bold rounded-full bg-darkText text-lightText'>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className='inline-block pl-4'>
                <div className='py-1 text-xl font-semibold text-darkText'>Công tác - dịch vụ</div>
                <div className='text-sm text-darkText'>dung.dononstop318@hcmut.edu.vn</div>
              </div>
            </div>
            <div className='flex pt-12'>
              <div className='items-center p-3 px-4 text-2xl font-bold rounded-full bg-darkText text-lightText'>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className='inline-block pl-4'>
                <div className='py-1 text-xl font-semibold'>Quản lý sinh viên</div>
                <div className='text-darkText'>dung.dononstop318@hcmut.edu.vn</div>
              </div>
            </div>
            <div className='flex pt-12'>
              <div className='items-center p-3 px-4 text-2xl font-bold rounded-full bg-darkText text-lightText'>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className='inline-block pl-4'>
                <div className='py-1 text-xl font-semibold'>Số điện thoại dịch vụ</div>
                <div className='text-darkText'>0868712144</div>
              </div>
            </div>



            <div className='py-10 text-darkText'>
              <div className='font-bold'>WORKING HOURS</div>
              <div>
                <div>Thứ hai - Thứ 6: 08:00 -19:30</div>
                <div>Thứ bảy: 10:00 - 16:30</div>
                <div>Chủ nhật: 10:00 - 16:30</div>
              </div>
            </div>
          </div>
      </div>

      <div className='bg-mainBg border-t-[0.1px] border-y-black shrink-0 flex flex-col justify-between'>
        <div className='w-full p-2 text-xs text-center text-gray-400 bg-slate-700'>Copyright 2024 © CNPM</div>
      </div>
    </div>
  )
}
