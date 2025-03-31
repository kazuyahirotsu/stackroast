import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = params.id;
  
  try {
    // Test if the OG image endpoint is accessible
    const ogResponse = await fetch(`${process.env.VERCEL_URL || 'https://roastmystack.vercel.app'}/api/og/roast/${id}`);
    
    // Return diagnostic information
    return NextResponse.json({
      status: 'success',
      ogImageStatus: ogResponse.status,
      ogImageUrl: `/api/og/roast/${id}`,
      absoluteOgImageUrl: `${process.env.VERCEL_URL || 'https://roastmystack.vercel.app'}/api/og/roast/${id}`,
      contentType: ogResponse.headers.get('content-type'),
      id: id
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      id: id
    }, { status: 500 });
  }
} 