import React from 'react';

const Header = ({ showMenu, setShowMenu }) => {
    return(
    <div id='Header' className='text-black bg-white flex flex-row justify-between items-center px-4 md:px-10 py-4 relative'>
          <div id="Logo" className='flex flex-row gap-3 items-center'>
            <img src="src/img/Icon.png" alt="Logo" className='w-6 h-6' />
            <h1 className='text-black text-3xl font-bold'>Nexcent</h1>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="md:hidden block">
            <img src="img/menu.svg" alt="menu" className="w-6 h-6" />
          </button>

          <div className={`flex-col md:flex-row gap-6 items-center ${showMenu ? 'flex' : 'hidden'} md:flex absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 z-10`}>
            <p className='text-black text-xl hover:text-sky-400'>Home</p>
            <p className='text-black text-xl hover:text-sky-400'>Features</p>
            <p className='text-black text-xl hover:text-sky-400'>Community</p>
            <p className='text-black text-xl hover:text-sky-400'>Blog</p>
            <p className='text-black text-xl hover:text-sky-400'>Pricing</p>
            <button className='bg-green-600 hover:bg-green-700 text-white flex flex-row gap-1 items-center px-4 py-2 rounded'>
              Register Now
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
    );
};

export default Header;