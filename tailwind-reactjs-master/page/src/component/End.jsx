 import React from 'react';

const End = ({ items = [] }) => {
  return (
    <div id='End' className='bg-black text-white flex flex-col md:flex-row justify-between items-start p-6 md:p-8 gap-6'>
      <div className='flex flex-col gap-6 items-start'>
        <div id="Logo" className='flex flex-row gap-3 items-center'>
          <img src="src/img/Icon.png" alt="Logo" className='w-6 h-6' />
          <h1 className='text-xl sm:text-2xl font-bold'>Nexcent</h1>
        </div>
        <div id='content' className='flex flex-col text-sm'>
          <p className='font-extralight'>Copyright © 2020 Landify UI Kit.</p>
          <p className='font-extralight'>All rights reserved</p>
        </div>
        <div id='social-icon' className='flex flex-row items-center gap-3 mt-2'>
          {items.map((item, index) => (
            <img key={index} src={item.icon} alt={item.title} className='w-8 h-8' />
          ))}
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-row-3 gap-4'>
        <div className='flex flex-col gap-2 items-start'>
          <h1 className='text-lg sm:text-xl font-bold'>Company</h1>
          <p className='text-sm font-extralight'>About us</p>
          <p className='text-sm font-extralight'>Blog</p>
          <p className='text-sm font-extralight'>Contact us</p>
          <p className='text-sm font-extralight'>Pricing</p>
          <p className='text-sm font-extralight'>Testimonials</p>
        </div>
        <div className='flex flex-col gap-2 items-start'>
          <h1 className='text-lg sm:text-xl font-bold'>Support</h1>
          <p className='text-sm font-extralight'>Help center</p>
          <p className='text-sm font-extralight'>Terms of service</p>
          <p className='text-sm font-extralight'>Legal</p>
          <p className='text-sm font-extralight'>Privacy policy</p>
          <p className='text-sm font-extralight'>Status</p>
        </div>
        <div className='flex flex-col gap-8 items-start w-full sm:max-w-sm md:max-w-md lg:max-w-xs'>
         <h1 className='text-lg sm:text-xl font-bold'>Stay up to date</h1>
        <div className="relative w-full">
        <input
        type="email"
        placeholder="Your email address"
        className="w-full bg-gray-600/50 text-white rounded-md pr-12 pl-4 py-2 placeholder-white 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
        />
        <button
          type="submit"
        className="absolute inset-y-0 right-2 flex items-center justify-center"
        >
        <img src="src/img/plane.svg" alt="Send" className="w-5 h-5 hover:scale-110 transition-transform" />
        </button>
    </div>
</div>
        </div>
      </div>
  );
};

export default End;
