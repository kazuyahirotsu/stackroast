import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '@/components/ShareButtons';
import TechLogo from '@/components/TechLogo';

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
      .select('content, stacks(frontend, backend, database)')
      .eq('id', id)
      .single();

    if (!roast) {
      return {
        title: 'Roast Not Found',
        description: 'The requested tech stack roast could not be found',
      };
    }

    // Extract first line as title
    const title = roast.content.split('\n')[0].replace(/^#\s+/, '');
    
    return {
      title: `${title} | RoastMyStack`,
      description: `Tech stack roast for ${roast.stacks.frontend}, ${roast.stacks.backend}, and ${roast.stacks.database}`,
      openGraph: {
        images: [`/api/og/roast/${id}`],
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
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: roast.content.replace(/\n/g, '<br>') }}></div>
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
            <Link href="/" className="btn btn-primary">
              Roast Another Stack
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 