import React from 'react';

const Updates = ({ title, description, posts }) => {
  return (
    <div id='Community Updates' className='flex flex-col p-4 gap-6'>
      <div className='flex flex-col gap-2 justify-center items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 text-center'>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>{title}</h1>
        <p className='text-sm sm:text-base text-gray-600 max-w-2xl'>{description}</p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20'>
        {posts.map((post, index) => (
          <div key={index} className="max-w-xs bg-white rounded-xl shadow-md overflow-hidden mx-auto">
            <img src={post.image} alt="" className="w-full h-48 object-cover" />
            <div className='bg-teal-50 flex flex-col items-center justify-center p-6 gap-3'>
              <p className="text-center text-gray-800 font-semibold text-base">
                {post.text}
              </p>

              <button className="group flex flex-row items-center gap-2 text-base text-green-600 hover:text-blue-600 font-semibold transition duration-300">
                Read more
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Updates;
