import React from 'react';

const Footer = ({ title, buttonText }) => {
  return (
    <div id='Footer' className='bg-teal-50 flex flex-col justify-center items-center px-4 py-8 sm:px-8  md:px-12  lg:px-24 gap-8 text-center'>
      <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800'>
        {title}
      </h1>
      <button className='bg-green-600 hover:bg-green-700 text-white flex flex-row gap-3 items-center px-4 py-2 rounded'>
        {buttonText}
        <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4 transition duration-300 group-hover:translate-x-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
      </button>
    </div>
  );
};

export default Footer;
