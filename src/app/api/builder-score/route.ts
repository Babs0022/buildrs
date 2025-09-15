
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TALENT_PROTOCOL_API_URL = 'https://api.talentprotocol.com/api/v1';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  if (!process.env.TALENT_PROTOCOL_API_KEY) {
    console.error('TALENT_PROTOCOL_API_KEY is not set.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await axios.get(`${TALENT_PROTOCOL_API_URL}/profiles/${address}`, {
      headers: {
        'X-API-KEY': process.env.TALENT_PROTOCOL_API_KEY,
      },
    });

    // The score is nested under a 'profile' object in the response
    const score = response.data?.profile?.score;

    if (score === undefined) {
      console.log('Full response from Talent Protocol:', response.data);
      return NextResponse.json({ score: 0 });
    }

    return NextResponse.json({ score });
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error fetching builder score from Talent Protocol:', error.response?.data || error.message);
    // Return a default score
    return NextResponse.json({ score: 0 });
  }
}
