
"use client";

import { useState } from 'react';

export default function AddBuildPage() {
  const [buildType, setBuildType] = useState('Launch');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Add a Build</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Build Type</label>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md ${buildType === 'Launch' ? 'bg-blue-600' : 'bg-gray-700'}`}
              onClick={() => setBuildType('Launch')}
            >
              Launch
            </button>
            <button
              className={`px-4 py-2 rounded-md ${buildType === 'Update' ? 'bg-yellow-600' : 'bg-gray-700'}`}
              onClick={() => setBuildType('Update')}
            >
              Update
            </button>
            <button
              className={`px-4 py-2 rounded-md ${buildType === 'Experiment' ? 'bg-green-600' : 'bg-gray-700'}`}
              onClick={() => setBuildType('Experiment')}
            >
              Experiment
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
          <input type="text" id="title" className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <textarea id="description" rows={4} className="w-full bg-gray-700 rounded-md p-2"></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input type="text" id="tags" className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="link" className="block text-sm font-medium mb-2">Link (Demo, Repo, or Screenshot)</label>
          <input type="text" id="link" className="w-full bg-gray-700 rounded-md p-2" />
        </div>
        <button className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Submit</button>
      </div>
    </div>
  );
}
