
"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

export default function AddBuildPage() {
  const { user } = useAuth();
  const [buildType, setBuildType] = useState('Launch');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to add a build');
      return;
    }

    if (!title || !description) {
      alert('Title and description are required');
      return;
    }

    try {
      await addDoc(collection(db, 'builds'), {
        type: buildType,
        title,
        description,
        tags: tags.split(',').map(tag => tag.trim()),
        link,
        createdAt: new Date(),
        userId: user.uid,
      });
      alert('Build added successfully!');
      // Clear form
      setBuildType('Launch');
      setTitle('');
      setDescription('');
      setTags('');
      setLink('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding build');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add a Build</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Build Type</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${buildType === 'Launch' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setBuildType('Launch')}
            >
              Launch
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${buildType === 'Update' ? 'bg-yellow-600' : 'bg-gray-700'}`}
              onClick={() => setBuildType('Update')}
            >
              Update
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${buildType === 'Experiment' ? 'bg-green-600' : 'bg-gray-700'}`}
              onClick={() => setBuildType('Experiment')}
            >
              Experiment
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-700 rounded-md p-2"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="link" className="block text-sm font-medium mb-2">Link (Demo, Repo, or Screenshot)</label>
          <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}
