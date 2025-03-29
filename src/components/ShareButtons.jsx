"use client";

import { useState, useEffect } from 'react';
import { FiCopy, FiShare2 } from 'react-icons/fi';
import { FaXTwitter, FaLink } from 'react-icons/fa6';
import Image from 'next/image';

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

export default function ShareButtons({ roastId, stack }) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/roast/${roastId}`
    : `/roast/${roastId}`;
  
  const ogImageUrl = `/api/og/roast/${roastId}`;
  
  // Format the tech stack info in the correct order
  const getOrderedStackSummary = () => {
    if (!stack) return '';
    
    // Get all valid stack items in the correct order
    const orderedItems = [];
    
    // First add items in the defined order
    for (const category of CATEGORY_ORDER) {
      if (stack[category] && typeof stack[category] === 'string' && category !== 'misc') {
        orderedItems.push(stack[category]);
      }
    }
    
    // Then add any remaining items that weren't in our predefined order
    Object.entries(stack)
      .filter(([key, value]) => 
        value && 
        typeof value === 'string' &&
        !CATEGORY_ORDER.includes(key) && 
        !['id', 'created_at', 'roast_id', 'misc'].includes(key)
      )
      .forEach(([_, value]) => orderedItems.push(value));
    
    // Join them with the + separator
    return `I use ${orderedItems.join(' + ')}.`;
  };
  
  const stackSummary = getOrderedStackSummary();
  
  // Custom Twitter text format
  const twitterText = `Just got my stack roasted by RoastMyStack. ${stackSummary} The roast was brutal.\n`;
  const encodedTwitterText = encodeURIComponent(twitterText);
  const encodedShareUrl = encodeURIComponent(shareUrl);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Native share functionality for mobile devices
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RoastMyStack - Tech Stack Roast',
          text: `Just got my stack roasted by RoastMyStack. ${stackSummary} The roast was brutal.`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      {/* OG Image Preview - now with smaller size on desktop */}
      <div className="mb-4 mt-4">
        <div className="mx-auto bg-base-200 rounded-lg overflow-hidden max-w-md w-full">
          <div className="relative w-full h-0" style={{ paddingBottom: '52.5%' }}>
            <Image
              src={ogImageUrl}
              alt="Share preview card"
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loading loading-spinner loading-md"></div>
              </div>
            )}
          </div>
        </div>
        <div className="text-xs opacity-70 mt-1 text-center">
          This is how your roast will appear when shared on social media
        </div>
      </div>
      
      {/* Improved share buttons layout - centered with equal sizing */}
      <div className="flex justify-center gap-3 flex-wrap">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTwitterText}&url=${encodedShareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-black hover:bg-gray-800 text-white min-w-[140px] flex-1 max-w-[200px]"
        >
          <FaXTwitter className="mr-2" /> Share on X
        </a>
        
        {navigator.share && (
          <button 
            className="btn btn-outline min-w-[140px] flex-1 max-w-[200px]"
            onClick={handleNativeShare}
          >
            <FiShare2 className="mr-2" />
            Share
          </button>
        )}
        
        <button
          onClick={handleCopy}
          className="btn btn-outline min-w-[140px] flex-1 max-w-[200px]"
        >
          <FaLink className="mr-2" />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
      
    </div>
  );
} 