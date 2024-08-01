import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import { Transition } from '@headlessui/react';
import logo from '../../assets/br_logo.png'; // Update this path if necessary

const Navbar = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const modalRef = useRef(null);

  const handleWithdraw = (amount) => {
    setTotalAmount(prevAmount => prevAmount - amount);
  };

  const handleDeposit = (amount) => {
    setTotalAmount(prevAmount => prevAmount + amount);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
  };

  const handleOpenDepositModal = () => {
    setIsDepositModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsWithdrawModalOpen(false);
    setIsDepositModalOpen(false);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (isWithdrawModalOpen || isDepositModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWithdrawModalOpen, isDepositModalOpen]);

  const handleWithdrawClick = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount && !isNaN(amount) && amount > 0) {
      handleWithdraw(amount);
      setWithdrawAmount('');
      handleCloseModal();
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const handleDepositClick = () => {
    const amount = parseFloat(depositAmount);
    if (amount && !isNaN(amount) && amount > 0) {
      handleDeposit(amount);
      setDepositAmount('');
      handleCloseModal();
    } else {
      alert("Please enter a valid amount.");
    }
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-gray-300 text-black text-3xl font-bold p-3 rounded-lg">
          <img className='h-10 w-10' src={logo} alt="Logo" /> {/* Update with correct logo */}
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

      {isDepositModalOpen && (
        <div ref={modalRef} className="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border border-gray-300 p-2 rounded mb-4 w-full"
            />
            <div className="flex justify-end">
              <button 
                onClick={handleDepositClick} 
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Deposit
              </button>
              <button 
                onClick={handleCloseModal} 
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
