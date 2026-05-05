import React from 'react';

const Clients = ({ logos }) => {
  return (
    <div id='Clients' className='flex flex-col items-center justify-center gap-10 px-4 sm:px-6 md:px-10 py-10'>
      <div id='Section Title' className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-4xl text-center font-bold text-gray-800'>Our Clients</h1>
        <p className='text-lg text-center font-normal'>
          We have been working with some Fortune 500+ clients
        </p>
      </div>

      <div
        id='Client logo'
        className='flex flex-row gap-4 sm:gap-6 md:gap-10 lg:gap-20 items-center justify-center w-full overflow-x-auto scroll-smooth px-0 sm:px-6 md:px-10'
      >
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt={`Client ${i + 1}`}
            className='h-6 sm:h-8 md:h-10 lg:h-12 object-contain flex-shrink-0'
          />
        ))}
      </div>
    </div>
  );
};

export default Clients;
