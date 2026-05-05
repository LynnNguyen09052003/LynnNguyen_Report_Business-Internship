import React from 'react';

const Community = ({ items = [] }) => {
  return (
    <div id='Community' className='bg-white flex flex-col items-center justify-center gap-6 p-4'>
      <div id='Community title' className='flex flex-col items-center text-center gap-2 p-4'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
          Manage your entire community in a single system
        </h1>
        <p className='text-sm font-extralight'>Who is Nextcent suitable for?</p>
      </div>

      <div id='Community frame' className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
        {Array.isArray(items) && items.map((item, index) => (
          <div key={index} className='flex flex-col items-center justify-center gap-2 text-center'>
            <img src={item.icon} alt={item.title} className='w-16 h-16' />
            <h1 className='text-lg sm:text-xl font-bold text-gray-800'>{item.title}</h1>
            <p className='text-sm font-extralight'>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
