
import axios from 'axios';

const TALENT_PROTOCOL_API_URL = 'https://api.talentprotocol.com/api/v1';

export async function getBuilderScore(userId: string): Promise<number> {
  try {
    const response = await axios.get(`${TALENT_PROTOCOL_API_URL}/profiles/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.TALENT_PROTOCOL_API_KEY}`,
      },
    });

    return response.data.builder_score;
  } catch (error) {
    console.error('Error fetching builder score:', error);
    // Return a default score in case of an error
    return 0;
  }
}
