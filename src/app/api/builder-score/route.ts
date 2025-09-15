
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

    // Log the entire successful response to inspect its structure
    console.log('Full successful response from Talent Protocol:', JSON.stringify(response.data, null, 2));

    const score = response.data?.profile?.score;

    if (score === undefined) {
      console.log('Score was not found at response.data.profile.score');
      return NextResponse.json({ score: 0 });
    }

    return NextResponse.json({ score });
  } catch (error: any) {
    // Log the full error object for detailed debugging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Talent Protocol API Error Status:', error.response.status);
      console.error('Talent Protocol API Error Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Talent Protocol API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Talent Protocol API Request Setup Error:', error.message);
    }
    return NextResponse.json({ score: 0 });
  }
}
