"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import 'devicon/devicon.min.css';

// Move the icon map outside the component to avoid recreating it on each render
const ICON_MAP = {
  'nextjs': 'devicon-nextjs-plain',
  'nextauthjs': 'devicon-nextjs-plain',
  'nuxt': 'devicon-nuxtjs-plain',
  'vanillajs': 'devicon-javascript-plain',
  'fastapi': 'devicon-fastapi-plain',
  'go': 'devicon-go-plain',
  'dynamodb': 'devicon-dynamodb-plain',
  'couchdb': 'devicon-couchdb-plain',
  'aws': 'devicon-amazonwebservices-plain-wordmark',
  'digitalocean': 'devicon-digitalocean-original',
  'railway': 'devicon-railway-original',
  'mui': 'devicon-materialui-plain',
  'oauth': 'devicon-oauth-plain',
  'react': 'devicon-react-original',
  'vue': 'devicon-vuejs-plain',
  'angular': 'devicon-angularjs-plain',
  'svelte': 'devicon-svelte-plain',
  'jquery': 'devicon-jquery-plain',
  'nodejs': 'devicon-nodejs-plain',
  'express': 'devicon-express-original',
  'django': 'devicon-django-plain',
  'flask': 'devicon-flask-original',
  'rubyonrails': 'devicon-rails-plain',
  'laravel': 'devicon-laravel-plain',
  'springboot': 'devicon-spring-original',
  'postgresql': 'devicon-postgresql-plain',
  'mysql': 'devicon-mysql-plain',
  'mongodb': 'devicon-mongodb-plain',
  'supabase': 'devicon-supabase-plain',
  'supabaseauth': 'devicon-supabase-plain',
  'firebaseauth': 'devicon-firebase-plain',
  'firebase': 'devicon-firebase-plain',
  'sqlite': 'devicon-sqlite-plain',
  'redis': 'devicon-redis-plain',
  'tailwindcss': 'devicon-tailwindcss-original',
  'bootstrap': 'devicon-bootstrap-plain',
  'sass': 'devicon-sass-original',
  'vercel': 'devicon-vercel-original',
  'netlify': 'devicon-netlify-plain',
  'gcp': 'devicon-googlecloud-plain',
  'azure': 'devicon-azure-plain',
  'heroku': 'devicon-heroku-original',
  // Add more mappings as needed
};

export default function TechLogo({ tech, size = 24 }) {
  // Prepare container class
  const containerClass = `w-${size/3} h-${size/3} bg-base-100 rounded-full flex items-center justify-center overflow-hidden`;

  if (!tech) {
    return <div className={containerClass}></div>;
  }
  
  // Directly check if we have an icon for this tech without using state
  const normalized = tech.toLowerCase().replace(/[^\w]/g, '');
  const iconClass = ICON_MAP[normalized];
  
  // If we have an icon class, use devicon
  if (iconClass) {
    return (
      <div className={containerClass}>
        <i className={`${iconClass} colored`} style={{ fontSize: `${size}px` }}></i>
      </div>
    );
  } 
  
  // Fallback to image only if no devicon is available
  const logoPath = `/logos/${normalized}.svg`;
  
  return (
    <div className={containerClass}>
      <Image 
        src={logoPath} 
        alt={tech || "Technology logo"}
        width={size}
        height={size}
        className="object-contain"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
} 