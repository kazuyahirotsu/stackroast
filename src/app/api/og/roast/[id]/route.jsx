import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

// Complete tech icon map based on TechLogo.jsx mappings
const TECH_ICON_URLS = {
  // Frontend
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  'svelte': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
  'nextjs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'nuxt': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg',
  'jquery': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg',
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'remix': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', // No specific Remix icon
  
  // Backend
  'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'django': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
  'flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  'rails': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-plain.svg',
  'laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
  'spring': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  'fastapi': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'go': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  
  // Database
  'postgresql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
  'firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'dynamodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  'sqlite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
  'redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  'couchdb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/couchdb/couchdb-original.svg',
  
  // Auth
  'oauth': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oauth/oauth-original.svg',
  
  // Hosting
  'aws': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  'digitalocean': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/digitalocean/digitalocean-original.svg',
  'railway': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/railway/railway-original.svg',
  'vercel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  'netlify': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg',
  'gcp': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  'azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  'heroku': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg',
  
  // Styling
  'tailwindcss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  'sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'mui': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
};

// Expanded special cases mapping
const SPECIAL_CASES = {
  'nextjs': 'nextjs',
  'nextauthjs': 'nextjs',
  'nuxtjs': 'nuxt',
  'vanillajs': 'javascript',
  'rubyonrails': 'rails',
  'springboot': 'spring',
  'supabaseauth': 'supabase',
  'firebaseauth': 'firebase',
  'tailwind': 'tailwindcss',
  'amazonwebservices': 'aws',
  'googlecloud': 'gcp',
  'materialui': 'mui',
};

// Helper to get tech icon URL with expanded mapping
function getTechIconUrl(tech) {
  if (!tech) return null;
  const normalized = tech.toLowerCase().replace(/[^\w]/g, '');
  const key = SPECIAL_CASES[normalized] || normalized;
  return TECH_ICON_URLS[key] || null;
}

export async function GET(request, props) {
  try {
    const params = await props.params;
    const id = params.id;
    
    if (!id) {
      return new Response('Missing roast ID', { status: 400 });
    }
    
    const { data: roast, error } = await supabase
      .from('roasts')
      .select('content, stacks(*)')
      .eq('id', id)
      .single();
      
    if (error || !roast) {
      return new Response('Roast not found', { status: 404 });
    }
    
    // Extract content parts
    const contentLines = roast.content.split('\n').filter(line => line.trim() !== '');
    const title = contentLines[0].replace(/^#\s+/, '');
    
    // Get excerpt (next 1-2 lines after title, up to 120 chars)
    let excerpt = '';
    if (contentLines.length > 1) {
      excerpt = contentLines.slice(1, 3).join(' ').slice(0, 120);
      if (excerpt.length === 120) excerpt += '...';
    }
    
    // Get tech stack details
    const stack = roast.stacks;
    
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
          }}
        >
          {/* Header with logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ fontSize: '36px' }}>🔥</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>RoastMyStack</div>
          </div>
          
          {/* Content container with gradient border */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
            borderRadius: '16px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            {/* Title */}
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              color: '#ff6b6b',
              lineHeight: 1.2,
            }}>
              {title}
            </h1>
            
            {/* Excerpt */}
            {excerpt && (
              <p style={{ 
                fontSize: '28px', 
                lineHeight: 1.4,
                opacity: 0.9,
                margin: '0 0 30px 0',
                fontStyle: 'italic',
              }}>
                "{excerpt}"
              </p>
            )}
            
            {/* Tech stack with logos - now with colored icons */}
            <div style={{ 
              marginTop: 'auto',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}>
              {stack.frontend && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(30, 30, 30, 0.8)', // Darker background for colored icons
                  borderRadius: '8px',
                  maxWidth: '250px',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                }}>
                  {getTechIconUrl(stack.frontend) ? (
                    <img 
                      src={getTechIconUrl(stack.frontend)} 
                      width="24" 
                      height="24" 
                    />
                  ) : null}
                  <span style={{ fontSize: '18px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {stack.frontend}
                  </span>
                </div>
              )}
              
              {stack.backend && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(30, 30, 30, 0.8)', // Darker background
                  borderRadius: '8px',
                  maxWidth: '250px',
                  border: '1px solid rgba(129, 230, 217, 0.3)',
                }}>
                  {getTechIconUrl(stack.backend) ? (
                    <img 
                      src={getTechIconUrl(stack.backend)} 
                      width="24" 
                      height="24" 
                    />
                  ) : null}
                  <span style={{ fontSize: '18px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {stack.backend}
                  </span>
                </div>
              )}
              
              {stack.database && (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(30, 30, 30, 0.8)', // Darker background
                  borderRadius: '8px',
                  maxWidth: '250px',
                  border: '1px solid rgba(144, 190, 255, 0.3)',
                }}>
                  {getTechIconUrl(stack.database) ? (
                    <img 
                      src={getTechIconUrl(stack.database)} 
                      width="24" 
                      height="24" 
                    />
                  ) : null}
                  <span style={{ fontSize: '18px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {stack.database}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer with website URL */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '30px',
            fontSize: '18px',
          }}>
            <span style={{ opacity: 0.8 }}>Brutal tech stack criticism by AI</span>
            <span style={{ 
              fontWeight: 'bold',
              color: '#ff6b6b',
            }}>
              stackroast.vercel.app
            </span>
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
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
} 