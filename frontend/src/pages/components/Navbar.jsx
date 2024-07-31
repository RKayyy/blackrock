import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import logo from '../../assets/br_logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-gray-300 text-black text-3xl font-bold p-3 rounded-lg">
        <svg id="logo-70" width="78" height="30" viewBox="0 0 78 30" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18.5147 0C15.4686 0 12.5473 1.21005 10.3934 3.36396L3.36396 10.3934C1.21005 12.5473 0 15.4686 0 18.5147C0 24.8579 5.14214 30 11.4853 30C14.5314 30 17.4527 28.7899 19.6066 26.636L24.4689 21.7737C24.469 21.7738 24.4689 21.7736 24.4689 21.7737L38.636 7.6066C39.6647 6.57791 41.0599 6 42.5147 6C44.9503 6 47.0152 7.58741 47.7311 9.78407L52.2022 5.31296C50.1625 2.11834 46.586 0 42.5147 0C39.4686 0 36.5473 1.21005 34.3934 3.36396L15.364 22.3934C14.3353 23.4221 12.9401 24 11.4853 24C8.45584 24 6 21.5442 6 18.5147C6 17.0599 6.57791 15.6647 7.6066 14.636L14.636 7.6066C15.6647 6.57791 17.0599 6 18.5147 6C20.9504 6 23.0152 7.58748 23.7311 9.78421L28.2023 5.31307C26.1626 2.1184 22.5861 0 18.5147 0Z" class="ccustom" fill="#394149"></path> <path d="M39.364 22.3934C38.3353 23.4221 36.9401 24 35.4853 24C33.05 24 30.9853 22.413 30.2692 20.2167L25.7982 24.6877C27.838 27.8819 31.4143 30 35.4853 30C38.5314 30 41.4527 28.7899 43.6066 26.636L62.636 7.6066C63.6647 6.57791 65.0599 6 66.5147 6C69.5442 6 72 8.45584 72 11.4853C72 12.9401 71.4221 14.3353 70.3934 15.364L63.364 22.3934C62.3353 23.4221 60.9401 24 59.4853 24C57.0498 24 54.985 22.4127 54.269 20.2162L49.798 24.6873C51.8377 27.8818 55.4141 30 59.4853 30C62.5314 30 65.4527 28.7899 67.6066 26.636L74.636 19.6066C76.7899 17.4527 78 14.5314 78 11.4853C78 5.14214 72.8579 0 66.5147 0C63.4686 0 60.5473 1.21005 58.3934 3.36396L39.364 22.3934Z" class="ccustom" fill="#394149"></path> </svg>
          <span className='text-bold'>FINGG</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="bg-gray-300 text-black hover:bg-gray-400 transition duration-300 hover:shadow-lg p-3 rounded-lg border border-black">Home</a>
          <a href="#about" className="bg-gray-300 text-black hover:bg-gray-400 transition duration-300 hover:shadow-lg p-3 rounded-lg border border-black">About</a>
          <a href="#services" className="bg-gray-300 text-black hover:bg-gray-400 transition duration-300 hover:shadow-lg p-3 rounded-lg border border-black">Services</a>
          <a href="#contact" className="bg-gray-300 text-black hover:bg-gray-400 transition duration-300 hover:shadow-lg p-3 rounded-lg border border-black">Contact</a>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <Transition
        show={isOpen}
        enter="transition-transform transform duration-300"
        enterFrom="scale-95 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition-transform transform duration-300"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-95 opacity-0"
      >
        <div className={`md:hidden absolute top-full left-0 w-full bg-gray-300 py-4`}>
          <a href="#home" className="block text-black text-center py-2 hover:bg-gray-400 transition duration-300 hover:shadow-lg border-b border-black">Home</a>
          <a href="#about" className="block text-black text-center py-2 hover:bg-gray-400 transition duration-300 hover:shadow-lg border-b border-black">About</a>
          <a href="#services" className="block text-black text-center py-2 hover:bg-gray-400 transition duration-300 hover:shadow-lg border-b border-black">Services</a>
          <a href="#contact" className="block text-black text-center py-2 hover:bg-gray-400 transition duration-300 hover:shadow-lg border-b border-black">Contact</a>
        </div>
      </Transition>
    </nav>
  );
  
};

export default Navbar;
