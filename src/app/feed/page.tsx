
import Link from 'next/link';

// Placeholder data for builds
const builds = [
  {
    id: 1,
    builder: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
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
    builder: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    type: 'Update',
    title: 'Updated my portfolio website',
    description: 'Added a new section for my latest projects and improved the design.',
    tags: ['portfolio', 'web development', 'design'],
    link: '#',
    upvotes: 80,
    downvotes: 2,
  },
  {
    id: 3,
    builder: { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    type: 'Experiment',
    title: 'Experimenting with a new CSS framework',
    description: 'Trying out a new framework to see if it improves performance and developer experience.',
    tags: ['css', 'frontend', 'experiment'],
    link: '#',
    upvotes: 45,
    downvotes: 1,
  },
];

const buildTypeClasses = {
  Launch: 'bg-blue-600',
  Update: 'bg-yellow-600',
  Experiment: 'bg-green-600',
};

export default function FeedPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Build Feed</h1>
        <Link href="/add-build" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
          Add a Build
        </Link>
      </div>
      <div className="space-y-4">
        {builds.map((build) => (
          <div key={build.id} className="bg-gray-800 p-4 rounded-lg flex space-x-4">
            <div className={`w-2 ${buildTypeClasses[build.type]}`}></div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <img src={build.builder.avatar} alt={build.builder.name} className="w-8 h-8 rounded-full" />
                <span className="font-bold">{build.builder.name}</span>
              </div>
              <h2 className="text-xl font-bold">{build.title}</h2>
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
                  <button>Comment</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
