import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';

function Signup() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <header className="text-center">
        <SignedOut>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to [Your App Name]</h1>
            <p className="text-gray-600 mb-6">Sign up to get started</p>
            <SignInButton className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200" />
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200" />
        </SignedIn>
      </header>
    </div>
  );
}

export default Signup;
