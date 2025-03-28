import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import TechLogo from './TechLogo';

export async function LatestRoasts() {
  const { data: roasts, error } = await supabase
    .from('roasts')
    .select('id, created_at, content, stacks(frontend, backend, database, auth, hosting, styling, misc)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(3);

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

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Latest Roasted Stacks</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roasts.map((roast) => (
          <Link 
            key={roast.id} 
            href={`/roast/${roast.id}`}
            className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="card-body">
              <h3 className="card-title text-sm font-medium line-clamp-2">
                {extractTitle(roast.content)}
              </h3>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {Object.entries(roast.stacks)
                  .filter(([key, value]) => value && !['id', 'created_at', 'user_id', 'misc'].includes(key))
                  .map(([_, tech]) => (
                    <div key={tech} className="badge badge-ghost badge-sm gap-1">
                      <TechLogo tech={tech} size={14} />
                      <span className="text-xs">{tech}</span>
                    </div>
                  ))}
              </div>
              
              {roast.stacks.misc && (
                <div className="mt-2 text-xs text-gray-400 line-clamp-1">
                  +{roast.stacks.misc}
                </div>
              )}
              
              <div className="mt-3 flex justify-between items-center">
                <div className="text-xs opacity-60">
                  {new Date(roast.created_at).toLocaleDateString()}
                </div>
                <div className="text-red-500 text-sm">View roast →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LatestRoasts; 