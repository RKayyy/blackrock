import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-4 shadow-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-gray-800 text-2xl font-bold">
          <a href="/">MyLogo</a>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#home" className="text-gray-800 hover:text-gray-600 transition duration-300 hover:shadow-lg">Home</a>
          <a href="#about" className="text-gray-800 hover:text-gray-600 transition duration-300 hover:shadow-lg">About</a>
          <a href="#services" className="text-gray-800 hover:text-gray-600 transition duration-300 hover:shadow-lg">Services</a>
          <a href="#contact" className="text-gray-800 hover:text-gray-600 transition duration-300 hover:shadow-lg">Contact</a>
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
        <div className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 py-4`}>
          <a href="#home" className="block text-gray-800 text-center py-2 hover:bg-gray-100 transition duration-300 hover:shadow-lg">Home</a>
          <a href="#about" className="block text-gray-800 text-center py-2 hover:bg-gray-100 transition duration-300 hover:shadow-lg">About</a>
          <a href="#services" className="block text-gray-800 text-center py-2 hover:bg-gray-100 transition duration-300 hover:shadow-lg">Services</a>
          <a href="#contact" className="block text-gray-800 text-center py-2 hover:bg-gray-100 transition duration-300 hover:shadow-lg">Contact</a>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
