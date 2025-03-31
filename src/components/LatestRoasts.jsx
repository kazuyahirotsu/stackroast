import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import TechLogo from './TechLogo';

// Add this export to prevent caching of this component
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Don't cache this data

// Define ordered categories for consistent display
const CATEGORY_ORDER = [
  'frontend',
  'backend',
  'database',
  'auth',
  'hosting',
  'styling',
  'misc'
];

export async function LatestRoasts() {
  // Fetch with a timestamp parameter to avoid caching
  const timestamp = new Date().getTime();
  
  const { data: roasts, error } = await supabase
    .from('roasts')
    .select('id, created_at, content, stacks(*)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(3)
    .throwOnError();
  
  if (error || !roasts || roasts.length === 0) {
    return null;
  }
  
  // Extract the title from the roast content (first line)
  const extractTitle = (content) => {
    const lines = content.split('\n');
    if (lines.length > 0) {
      // Remove any markdown formatting from the title
      return lines[0].replace(/^#\s+/, '');
    }
    return 'Tech Stack Roast';
  };
  
  // Get ordered stack items - only implement the ordering logic
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
        !['id', 'created_at', 'roast_id', 'user_id', 'misc'].includes(key)
      )
      .forEach(item => orderedItems.push(item));
    
    return orderedItems;
  };
  
  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Latest Roasted Stacks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roasts.map((roast) => {
          // Get ordered stack items
          const orderedStackItems = getOrderedStackItems(roast.stacks);
          
          return (
            <Link 
              key={roast.id} 
              href={`/roast/${roast.id}`}
              className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="card-body flex flex-col h-full">
                <h3 className="card-title text-sm font-medium line-clamp-2">
                  {extractTitle(roast.content)}
                </h3>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {orderedStackItems.map(([category, tech]) => {
                    if (!tech) return null;
                    
                    // Create a unique key by combining category and tech name
                    const uniqueKey = `${category}-${tech}`;
                    
                    return (
                      <div key={uniqueKey} className="badge badge-ghost badge-sm gap-1">
                        <TechLogo tech={tech} size={14} />
                        <span className="text-xs">{tech}</span>
                      </div>
                    );
                  })}
                </div>
                
                {roast.stacks.misc && (
                  <div className="mt-2 text-xs text-gray-400 line-clamp-1">
                    +{roast.stacks.misc}
                  </div>
                )}
                
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <div className="text-xs opacity-60">
                    {new Date(roast.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-red-500 text-sm">View roast →</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default LatestRoasts; 