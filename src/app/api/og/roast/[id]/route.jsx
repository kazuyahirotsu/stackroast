import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const { data: roast } = await supabase
      .from('roasts')
      .select('*, stacks(*)')
      .eq('id', id)
      .single();
    
    if (!roast) {
      return new Response('Roast not found', { status: 404 });
    }
    
    const stack = roast.stacks;
    
    // Create the OpenGraph image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e1e1e',
            color: 'white',
            padding: '40px',
            fontFamily: 'SF Pro, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: 60, marginRight: '12px' }}>🔥</div>
            <h1 style={{ fontSize: 48, fontWeight: 'bold' }}>StackRoast</h1>
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#2d2d2d',
              borderRadius: '16px',
              padding: '32px',
              width: '90%',
              maxWidth: '800px',
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontStyle: 'italic',
                textAlign: 'center',
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#512da8',
                borderRadius: '8px',
                width: '100%',
              }}
            >
              "{roast.content}"
            </div>
            
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                width: '100%',
              }}
            >
              {Object.entries(stack)
                .filter(([key, value]) => value && !['id', 'created_at', 'user_id'].includes(key))
                .map(([category, tech]) => (
                  <div
                    key={category}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#3d3d3d',
                      borderRadius: '8px',
                      padding: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ color: '#aaa', fontSize: 16, textTransform: 'capitalize' }}>
                      {category}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: 20 }}>
                      {tech}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              fontSize: 16,
              opacity: 0.7,
            }}
          >
            stackroast.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
} 