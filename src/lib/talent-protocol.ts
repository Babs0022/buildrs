
import axios from 'axios';

export async function getBuilderScore(address: string): Promise<number> {
  if (!address) {
    console.error("Address is required to fetch builder score.");
    return 0;
  }
  try {
    // The client-side function now calls our own API route
    const response = await axios.get(`/api/builder-score?address=${address}`);
    return response.data.score || 0;
  } catch (error) {
    console.error('Error fetching builder score from our API:', error);
    return 0;
  }
}
