import { GET } from '../ping/route';
import { NextRequest } from 'next/server';

describe('/api/ping', () => {
  it('returns successful response', async () => {
    const request = new NextRequest('http://localhost:3000/api/ping');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toEqual({
      success: true,
      message: 'Server is running',
      timestamp: expect.any(String),
    });
  });

  it('returns timestamp in ISO format', async () => {
    const request = new NextRequest('http://localhost:3000/api/ping');
    const response = await GET(request);
    const data = await response.json();
    
    // Check if timestamp is a valid ISO string
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp);
  });

  it('includes correct headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/ping');
    const response = await GET(request);
    
    expect(response.headers.get('content-type')).toBe('application/json');
  });
});
