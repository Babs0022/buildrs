
import { FaTwitter, FaGithub } from 'react-icons/fa6';
import { FaFarcaster } from 'react-icons/fa';

// Placeholder data for the profile
const profileData = {
  name: 'Babs',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  bio: 'Building the future, one line of code at a time.',
  socialLinks: {
    twitter: '#',
    github: '#',
    farcaster: '#',
  },
  builderScore: 950,
  builds: [
    {
      id: 1,
      type: 'Launch',
      title: 'Launched a new project management tool',
      description: 'This tool helps teams organize their tasks and collaborate effectively.',
      tags: ['project management', 'productivity', 'saas'],
      link: '#',
      upvotes: 120,
      downvotes: 5,
    },
    {
      id: 2,
      type: 'Update',
      title: 'Updated my portfolio website',
      description: 'Added a new section for my latest projects and improved the design.',
      tags: ['portfolio', 'web development', 'design'],
      link: '#',
      upvotes: 80,
      downvotes: 2,
    },
  ],
};

const buildTypeClasses = {
    Launch: 'bg-blue-600',
    Update: 'bg-yellow-600',
    Experiment: 'bg-green-600',
  };

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-6">
        <img src={profileData.avatar} alt={profileData.name} className="w-24 h-24 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold">{profileData.name}</h1>
          <p className="text-gray-400">{profileData.bio}</p>
          <div className="flex space-x-4 mt-2">
            <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href={profileData.socialLinks.farcaster} target="_blank" rel="noopener noreferrer"><FaFarcaster /></a>
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-lg font-bold">Builder Score</div>
          <div className="text-3xl font-bold text-blue-400">{profileData.builderScore}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Builds</h2>
        <div className="space-y-4">
          {profileData.builds.map((build) => (
            <div key={build.id} className="bg-gray-800 p-4 rounded-lg flex space-x-4">
                 <div className={`w-2 ${buildTypeClasses[build.type]}`}></div>
                 <div className="flex-1">
                    <h3 className="text-xl font-bold">{build.title}</h3>
                    <p className="text-gray-400">{build.description}</p>
                    <div className="flex space-x-2 mt-2">
                        {build.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-700 rounded-md text-sm">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <a href={build.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Build</a>
                        <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1">
                            <span>▲</span>
                            <span>{build.upvotes}</span>
                        </button>
                        <button className="flex items-center space-x-1">
                            <span>▼</span>
                            <span>{build.downvotes}</span>
                        </button>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
