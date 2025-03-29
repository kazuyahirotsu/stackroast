import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Define tech logo URLs - same as in roast/[id]/route.jsx
const TECH_ICON_URLS = {
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'node': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
};

export async function GET() {
  try {
    // Updated example roast to showcase
    const exampleRoast = "Ah, the quintessential \"I wanna be a startup but still live in my parents' basement\" stack.";
    
    // Define tech stack with display names and logo keys
    const techStack = [
      { name: 'React', key: 'react' },
      { name: 'Node', key: 'node' },
      { name: 'Supabase', key: 'supabase' },
    ];
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            color: 'white',
            padding: '60px',
            fontFamily: 'SF Pro, system-ui, sans-serif',
            justifyContent: 'center',
            alignItems: 'center', // Center all items horizontally
            position: 'relative', // For absolute positioning of the URL
          }}
        >
          {/* Header with logo */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '40px',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '80px' }}>🔥</div>
            <div style={{ 
              fontSize: '72px', 
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #ff4d4d, #ff7e5f, #f86e40, #ff8b3d)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 2px 10px rgba(255, 76, 44, 0.3)',
            }}>
              RoastMyStack
            </div>
          </div>
          
          {/* Tagline */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '36px',
            textAlign: 'center',
            opacity: 0.9,
            marginBottom: '40px',
            maxWidth: '800px',
          }}>
            Get your tech stack brutally roasted by AI
          </div>
          
          {/* Example stack and roast showcase */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(30, 30, 30, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '40px', // Increased bottom margin
            border: '1px solid rgba(255, 77, 77, 0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            width: '85%',
            maxWidth: '1000px',
          }}>
            {/* Tech stack badges with logos */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '30px',
            }}>
              {techStack.map((tech, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: 'rgba(20, 20, 20, 0.8)',
                  border: '1px solid rgba(255, 77, 77, 0.3)',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}>
                  <img 
                    src={TECH_ICON_URLS[tech.key]} 
                    width="28" 
                    height="28" 
                    alt=""
                  />
                  {tech.name}
                </div>
              ))}
            </div>
            
            {/* Example roast */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '28px',
              textAlign: 'center',
              lineHeight: 1.5,
              position: 'relative',
              padding: '0 30px',
              maxWidth: '900px',
            }}>
              {exampleRoast}
            </div>
            
            <div style={{
              display: 'flex',
              position: 'relative',
              height: '20px',
              width: '100%',
            }}>
              <span style={{
                position: 'absolute',
                top: '-50px',
                left: '10px',
                fontSize: '60px',
                color: 'rgba(255, 77, 77, 0.5)',
                fontFamily: 'serif',
              }}>
                "
              </span>
              <span style={{
                position: 'absolute',
                top: '-50px',
                right: '10px',
                fontSize: '60px',
                color: 'rgba(255, 77, 77, 0.5)',
                fontFamily: 'serif',
              }}>
                "
              </span>
            </div>
          </div>
          
          {/* Website URL */}
          <div style={{
            display: 'flex',
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: 'bold',
              color: '#ff6b6b',
            }}>
              roastmystack.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        emoji: 'twemoji',
      }
    );
  } catch (error) {
    console.error('Error generating home OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
} 