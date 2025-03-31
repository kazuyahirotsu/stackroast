import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '@/components/ShareButtons';
import TechLogo from '@/components/TechLogo';

// Function to format roast content by separating title and body
function formatRoastContent(content) {
  const lines = content.split('\n');
  if (lines.length === 0) return { title: '', body: '' };
  
  // First line is the title (remove any markdown # if present)
  const title = lines[0].replace(/^#\s+/, '');
  
  // Rest is the body (join with <br> tags for display)
  const body = lines.slice(1).join('<br>');
  
  return { title, body };
}

// Generate metadata for the page including OG image
export async function generateMetadata(props) {
  // In Next.js 15, we need to await the entire params object
  const params = await props.params;
  const id = params.id;
  
  if (!id) {
    return {
      title: 'Roast Not Found',
      description: 'The requested tech stack roast could not be found',
    };
  }

  try {
    const { data: roast } = await supabase
      .from('roasts')
      .select('content, stacks(frontend, backend, database, auth, hosting, styling)')
      .eq('id', id)
      .single();

    if (!roast) {
      return {
        title: 'Roast Not Found',
        description: 'The requested tech stack roast could not be found',
      };
    }

    // Extract first line as title
    const title = roast.content.split('\n')[0].replace(/^#\s+/, '').replace(/"/g, '');
    
    // Build tech stack description with available technologies
    const stackParts = [];
    if (roast.stacks.frontend) stackParts.push(roast.stacks.frontend);
    if (roast.stacks.backend) stackParts.push(roast.stacks.backend);
    if (roast.stacks.database) stackParts.push(roast.stacks.database);
    
    const stackDescription = stackParts.join(', ');
    const description = `Tech stack roast for ${stackDescription}`;
    
    // Absolute URL without relying on environment variables
    const absoluteOgImageUrl = `https://roastmystack.vercel.app/api/og/roast/${id}`;
    
    return {
      metadataBase: new URL('https://roastmystack.vercel.app'),
      title: `${title} | RoastMyStack`,
      description: description,
      openGraph: {
        title: `${title} | RoastMyStack`,
        description: description,
        url: `https://roastmystack.vercel.app/roast/${id}`,
        siteName: 'RoastMyStack',
        locale: 'en_US',
        type: 'website',
        images: [
          {
            url: absoluteOgImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | RoastMyStack`,
        description: description,
        images: [absoluteOgImageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tech Stack Roast',
      description: 'View this roasted tech stack',
    };
  }
}

export default async function RoastPage(props) {
  // In Next.js 15, we need to await the entire params object
  const params = await props.params;
  const id = params.id;
  
  if (!id) {
    notFound();
  }
  
  const { data: roast, error } = await supabase
    .from('roasts')
    .select('*, stacks(*)')
    .eq('id', id)
    .single();
  
  if (error || !roast) {
    notFound();
  }
  
  const stack = roast.stacks;
  
  const CATEGORY_ORDER = [
    'frontend',
    'backend',
    'database',
    'auth',
    'hosting',
    'styling',
    'misc'
  ];

  // Get ordered stack items
  const getOrderedStackItems = (stack) => {
    if (!stack) return [];
    
    // Get all items in the correct order
    const orderedItems = [];
    
    // First add items in the defined order (excluding misc)
    for (const category of CATEGORY_ORDER) {
      if (stack[category] && typeof stack[category] === 'string' && category !== 'misc') {
        orderedItems.push([category, stack[category]]);
      }
    }
    
    // Then add any remaining items
    Object.entries(stack)
      .filter(([key, value]) => 
        value && 
        typeof value === 'string' &&
        !CATEGORY_ORDER.includes(key) && 
        !['id', 'created_at', 'roast_id'].includes(key)
      )
      .forEach(item => orderedItems.push(item));
    
    return orderedItems;
  };

  const orderedStackItems = getOrderedStackItems(stack);
  
  const { title, body } = formatRoastContent(roast.content);
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Your Stack Roast</h1>
        <p className="text-sm opacity-70">
          Created {new Date(roast.created_at).toLocaleDateString()}
        </p>
      </section>
      
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <div className="prose max-w-full">
            <div className="mb-6 flex items-center justify-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl animate-pulse-subtle">
                🔥
              </div>
            </div>
            
            {/* Title with special font */}
            <h2 className="roast-title text-2xl md:text-3xl font-black mb-6 text-center">
              {title}
            </h2>
            
            {/* Body with different font */}
            <div 
              className="roast-body text-lg font-normal leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: body }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Your Tech Stack</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {orderedStackItems
              .filter(([category]) => category !== 'misc')
              .map(([category, tech]) => (
                <div key={category} className="bg-base-200 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-base-100 rounded-full flex items-center justify-center mr-2">
                      <TechLogo tech={tech} size={24} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{category}</div>
                      <div className="font-medium">{tech}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {stack.misc && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-1">Additional tools:</div>
              <div className="bg-base-200 rounded-lg p-3">
                {stack.misc}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Share Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Share Your Roast</h2>
          <ShareButtons roastId={id} stack={stack} />
          
          <div className="divider"></div>
          
          <div className="flex justify-center">
            <Link href="/" className="btn bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white border-none">
              Roast Another Stack
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 