"use client";

import { useState, useRef, useEffect } from "react";
import TechLogo from './TechLogo';

export default function TechSelector({ options, value, onChange, allowCustom = true }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleOptionSelect = (option) => {
    onChange(option);
    setShowDropdown(false);
  };
  
  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCustomValue("");
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="input input-bordered flex items-center cursor-pointer h-12 bg-base-100"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {value ? (
          <div className="flex items-center gap-2">
            <TechLogo tech={value} size={24} />
            <span>{value}</span>
          </div>
        ) : (
          <span className="opacity-60">Select or type...</span>
        )}
      </div>
      
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-base-100 rounded-md shadow-lg border border-base-300 animate-slideDown">
          <div className="max-h-64 overflow-y-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <div 
                  key={option}
                  className="px-3 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-2"
                  onClick={() => handleOptionSelect(option)}
                >
                  <TechLogo tech={option} size={20} />
                  <span>{option}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm opacity-70">No options available</div>
            )}
          </div>
          
          {allowCustom && (
            <div className="p-2 border-t">
              <div className="flex">
                <input 
                  type="text"
                  className="input input-sm input-bordered flex-grow bg-base-100"
                  placeholder="Add custom..."
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomSubmit();
                    }
                  }}
                />
                <button 
                  type="button"
                  className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomSubmit();
                  }}
                  disabled={!customValue.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 