
// Placeholder data for the leaderboard
const leaderboardData = [
  {
    rank: 1,
    builder: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    builderScore: 950,
    totalUpvotes: 1250,
    streak: 30,
  },
  {
    rank: 2,
    builder: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    builderScore: 920,
    totalUpvotes: 1100,
    streak: 25,
  },
  {
    rank: 3,
    builder: { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    builderScore: 890,
    totalUpvotes: 1000,
    streak: 20,
  },
  {
    rank: 4,
    builder: { name: 'David', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
    builderScore: 850,
    totalUpvotes: 900,
    streak: 15,
  },
  {
    rank: 5,
    builder: { name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
    builderScore: 820,
    totalUpvotes: 800,
    streak: 10,
  },
];

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Builder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Builder Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Upvotes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaderboardData.map((item) => (
              <tr key={item.rank}>
                <td className="px-6 py-4 whitespace-nowrap">{item.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={item.builder.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{item.builder.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.builderScore}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.totalUpvotes}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.streak} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
