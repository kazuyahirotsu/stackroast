"use client";

import { useState } from 'react';
import { FiTwitter, FiCopy, FiShare2 } from 'react-icons/fi';

export default function ShareButtons({ roastId, className = '' }) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/roast/${roastId}`
    : `/roast/${roastId}`;
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleTwitterShare = () => {
    const text = "Check out my tech stack roast from StackRoast! 🔥";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My StackRoast',
          text: 'Check out my tech stack roast!',
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
    <div className={`${className} space-y-4`}>
      <div className="flex flex-wrap gap-2">
        <button 
          className="btn btn-outline btn-sm flex-1"
          onClick={handleTwitterShare}
        >
          <FiTwitter size={16} className="mr-2 text-red-500" />
          Twitter
        </button>
        
        <button 
          className="btn btn-outline btn-sm flex-1"
          onClick={handleCopy}
        >
          <FiCopy size={16} className="mr-2 text-red-500" />
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        
        {navigator.share && (
          <button 
            className="btn btn-outline btn-sm flex-1"
            onClick={handleNativeShare}
          >
            <FiShare2 size={16} className="mr-2 text-red-500" />
            Share
          </button>
        )}
      </div>
      
      <div className="bg-base-200 rounded-md p-2">
        <div className="text-xs opacity-70 mb-1">Share URL:</div>
        <div className="flex">
          <input 
            type="text" 
            className="input input-sm input-bordered flex-1" 
            value={shareUrl} 
            readOnly 
            onClick={(e) => e.target.select()}
          />
          <button 
            className="btn btn-sm btn-square bg-red-600 hover:bg-red-700 text-white border-none ml-1"
            onClick={handleCopy}
          >
            {copied ? '✓' : <FiCopy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
} 