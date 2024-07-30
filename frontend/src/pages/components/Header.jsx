import React from 'react';

function Header() {
  return (
    <div>
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <svg
              id="logo-50"
              className="gradient"
              width="153"
              height="38"
              viewBox="0 0 153 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.878785 28.1818L0.878788 9.39393L10.2727 14.6128L10.2727 23.0151L17.7879 27.2424L25.303 23.0151L25.303 14.6128L34.697 9.39393L34.697 28.1818L17.7879 37.5757L0.878785 28.1818Z"
                className="cneutral"
                fill="#192657"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.57576 12.0034L0.878784
            a href="/features" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </a>
          <a href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </a>
        </nav>
      </div>
    </header>
  </div>
  );
}

export default Header;
