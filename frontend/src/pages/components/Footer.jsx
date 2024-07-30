import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold">Company Name</h2>
            <p className="mt-2">Creating value for the future.</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.522 0-10 4.478-10 10 0 4.41 3.588 8.098 8.136 8.826v-6.216h-2.448v-2.61h2.448v-1.98c0-2.405 1.462-3.72 3.6-3.72 1.024 0 1.902.076 2.16.11v2.507h-1.48c-1.162 0-1.384.552-1.384 1.36v1.722h2.76l-.36 2.61h-2.4v6.216c4.548-.728 8.136-4.416 8.136-8.826 0-5.522-4.478-10-10-10z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.61.59-2.48.7.89-.53 1.58-1.38 1.9-2.4-.83.49-1.75.85-2.72 1.04a4.92 4.92 0 0 0-8.38 4.48c-4.08-.2-7.69-2.16-10.11-5.14-.42.72-.66 1.56-.66 2.46 0 1.7.87 3.2 2.2 4.08-.81-.03-1.57-.25-2.23-.62v.06c0 2.37 1.69 4.35 3.93 4.8-.41.11-.84.17-1.29.17-.31 0-.61-.03-.9-.08.62 1.94 2.41 3.36 4.53 3.4a9.87 9.87 0 0 1-6.1 2.1c-.4 0-.79-.02-1.17-.07a13.92 13.92 0 0 0 7.54 2.2c9.05 0 14-7.5 14-14v-.64c.96-.69 1.8-1.56 2.46-2.54z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.523 0-10 4.477-10 10 0 4.411 3.588 8.1 8.136 8.826v-6.216h-2.448v-2.61h2.448v-1.98c0-2.406 1.462-3.72 3.6-3.72 1.024 0 1.902.076 2.16.11v2.507h-1.48c-1.162 0-1.384.553-1.384 1.36v1.722h2.76l-.36 2.61h-2.4v6.216c4.548-.728 8.136-4.416 8.136-8.826 0-5.523-4.478-10-10-10z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.53 9.64v4.73c0 .39-.16.75-.42 1.02-.26.26-.63.41-1.02.41h-2.08v-3.86h1.5l.23-1.74h-1.73v-1.11c0-.5.14-.84.85-.84h.9v-1.52c-.18-.02-.8-.08-1.52-.08-1.51 0-2.53.92-2.53 2.61v1.46h-1.69v1.74h1.69v3.86h-7.28c-.39 0-.75-.16-1.02-.41-.26-.27-.41-.63-.41-1.02v-4.73c0-.39.15-.75.41-1.02.26-.26.63-.41 1.02-.41h15.06c.39 0 .75.15 1.02.41.26.27.41.63.41 1.02z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li><a href="#home" className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition duration-300">About</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition duration-300">Services</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition duration-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter to get the latest updates.</p>
            <form className="flex flex-col space-y-3">
              <input type="email" className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none" placeholder="Enter your email" />
              <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition duration-300">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500">&copy; 2024 Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
