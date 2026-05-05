import React from 'react';

const Body = ({ image, paragraph, author, position, logos }) => {
  return (
    <div id='Body' className='bg-teal-50 flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-10 py-6 gap-6 md:gap-10'>
      <div className='w-full md:w-1/2 flex items-center justify-center'>
        <img
          src={image}
          alt="Logo"
          className='w-32 sm:w-48 md:w-60 h-auto object-contain'
        />
      </div>

      <div className='w-full md:w-1/2 flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <p className='text-sm text-gray-600 text-left'>{paragraph}</p>
          <h1 className='text-xl font-semibold text-green-800 text-left'>{author}</h1>
          <p className='text-sm text-gray-600 text-left'>{position}</p>
        </div>

        <div
          id='Logo body'
          className="flex flex-wrap sm:flex-nowrap flex-row gap-2 sm:gap-4 md:gap-6 lg:gap-10 items-center justify-start w-full overflow-x-auto scroll-smooth pt-4"
        >
          {logos.slice(0, 6).map((logo, i) => (
            <div key={i} className="p-2 rounded transition duration-300 hover:bg-green-200 flex-shrink-0">
              <img
                src={logo}
                alt={`Client ${i + 1}`}
                className="h-10 transition duration-300 filter hover:invert hover:sepia hover:saturate-200 hover:hue-rotate-240 hover:brightness-125"
              />
            </div>
          ))}
          <button className="group flex flex-row items-center gap-2 text-base text-green-600 hover:text-blue-600 font-semibold transition duration-300 flex-shrink-0 whitespace-nowrap">
            Meet all customers
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
      </div>
    </div>
  );
};

export default Body;
