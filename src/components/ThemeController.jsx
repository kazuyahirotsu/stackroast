"use client";

import { useEffect } from 'react';

export default function ThemeController() {
  // Force dark mode on component mount
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);
  
  // No theme toggle button rendered
  return null;
} 