
"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      // Redirect to profile page
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error logging in: ', error);
      alert('Error logging in');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}
