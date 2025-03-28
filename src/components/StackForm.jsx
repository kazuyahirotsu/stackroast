"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TechSelector from "./TechSelector";

// Tech stack options for each category
const TECH_OPTIONS = {
  frontend: ["React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "jQuery", "Vanilla JS", "Remix"],
  backend: ["Node.js", "Express", "Django", "Flask", "Ruby on Rails", "Laravel", "Spring Boot", "FastAPI", "Go"],
  database: ["Supabase", "PostgreSQL", "MySQL", "MongoDB", "Firebase", "DynamoDB", "SQLite", "Redis", "CouchDB"],
  auth: ["Supabase Auth", "NextAuth.js", "Firebase Auth", "OAuth", "Auth0", "Clerk", "Cognito", "Custom JWT", "Magic Link"],
  hosting: ["Vercel", "Netlify", "AWS", "GCP", "Azure", "Digital Ocean", "Heroku", "Railway", "Render"],
  styling: ["Tailwind CSS", "MUI", "Bootstrap", "CSS Modules", "Styled Components", "Emotion", "SASS/SCSS", "Chakra UI"]
};

// Icons for each category with fire theme colors
const CATEGORY_ICONS = {
  frontend: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  backend: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  database: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  auth: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  hosting: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  styling: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  misc: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
};

export default function StackForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stack, setStack] = useState({
    frontend: "",
    backend: "",
    database: "",
    auth: "",
    hosting: "",
    styling: "",
    misc: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stack }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to roast stack');
      }
      
      const data = await response.json();
      router.push(`/roast/${data.id}`);
    } catch (error) {
      console.error('Error roasting stack:', error);
      alert('Failed to roast your stack. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (category, value) => {
    setStack(prev => ({ ...prev, [category]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(TECH_OPTIONS).map(([category, options]) => (
          <div key={category} className="form-control">
            <label className="label">
              <span className="font-medium capitalize flex items-center gap-2 text-gray-200">
                <span className="text-red-500">{CATEGORY_ICONS[category]}</span>
                {category}
              </span>
            </label>
            <TechSelector 
              options={options}
              value={stack[category]}
              onChange={(value) => handleChange(category, value)} 
              allowCustom
            />
          </div>
        ))}
      </div>
      
      <div className="form-control mt-4">
        <label className="label">
          <span className="font-medium flex items-center gap-2 text-gray-200">
            <span className="text-red-500">{CATEGORY_ICONS.misc}</span>
            Additional Tools (optional)
          </span>
        </label>
        <input
          type="text"
          placeholder="Other libraries, tools, or quirky tech choices..."
          className="input input-bordered w-full"
          value={stack.misc}
          onChange={(e) => handleChange('misc', e.target.value)}
        />
      </div>
      
      <div className="card bg-base-200 p-4 shadow-sm mt-6">
        <p className="text-sm mb-2">Ready to have your tech choices roasted? Our AI will analyze your stack for questionable decisions and potential issues.</p>
        <div className="text-xs opacity-70 mb-4">*For optimal roasting, please fill at least the Frontend, Backend, and Database fields.</div>
        
        <div className="card-actions justify-end">
          <button 
            type="submit" 
            className="btn bg-red-600 hover:bg-red-700 text-white border-none"
            disabled={isSubmitting || !stack.frontend || !stack.backend || !stack.database}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Roasting...
              </>
            ) : '🔥 Roast My Stack'}
          </button>
        </div>
      </div>
    </form>
  );
} 