import React from 'react';

const Achievements = ({ stats, title, subtitle }) => {
  return (
    <div id='Achievements' className='bg-teal-50 flex flex-col md:flex-row items-center justify-between gap-8 px-6 py-10'>
      <div className='flex flex-col items-start gap-4 md:w-1/2'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 text-left leading-snug'>
          {title}<br />
          <span className='text-green-600'>{subtitle}</span>
        </h1>
        <p className='text-sm sm:text-base text-gray-700'>
          We reached here with our hard work and dedication
        </p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:w-1/2'>
        {stats.map((item, index) => (
          <div key={index} className='flex items-center gap-3'>
            <img src={item.icon} alt={item.label} className='w-10 h-10' />
            <div>
              <h1 className='text-xl font-semibold text-gray-800'>{item.value}</h1>
              <p className='text-sm text-gray-600'>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
