
"use client";

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a profile document in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        name,
        avatar: '', // Add a default avatar
        bio: '',
        socialLinks: {},
      });

      alert('Signed up successfully!');
      // Redirect to profile page
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error signing up: ', error);
      alert('Error signing up');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignUp} className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Sign Up</button>
      </form>
    </div>
  );
}
