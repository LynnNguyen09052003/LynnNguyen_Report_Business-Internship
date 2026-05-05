import React from 'react';

const Home = ({ slides, activeIndex, setActiveIndex }) => {
  const { title, highlight, desc, image, buttonText, reverse, bgColor } = slides[activeIndex];

  return (
    <div
      id='Home'
      className={`relative ${bgColor} flex items-center justify-center gap-10 px-4 sm:px-6 md:px-10 py-10 transition-colors duration-500`}
    >
      <div
        className={`flex flex-col md:flex-row ${
          reverse ? 'md:flex-row-reverse' : ''
        } items-center justify-center gap-10`}
      >
        <div id='Frame1' className='flex flex-col w-full md:max-w-md gap-4 items-start'>
          <h1 className='text-4xl text-left font-bold text-gray-800'>
            {title} <span className='text-green-600'>{highlight}</span>
          </h1>
          <p className='text-gray-700 text-left'>{desc}</p>
          <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-fit'>
            {buttonText}
          </button>
        </div>
        <div id='Illustration' className='w-full max-w-md'>
          <img src={image} alt='Illustration' className='w-full h-auto' />
        </div>
      </div>

      {/* Dot */}
      <div id='Dot' className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              i === activeIndex ? 'bg-green-600 scale-125' : 'bg-gray-400'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Home;
