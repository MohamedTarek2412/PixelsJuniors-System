// src/components/Header.jsx
import React from 'react';

import  iconPixels  from "../../assets/images/360143781_659959762843806_5232583363801903658_n-removebg-preview.png";

export default function Header() {
  return (
    <div className="text-center mb-10">
      <div className="relative inline-block mb-6">
        <div 
          className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(212, 129, 37) 100%)`,
            boxShadow: '0 20px 40px rgba(227, 106, 37, 0.3)'
          }}
        >
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
         <img 
  src={iconPixels} 
  alt="Logo" 
  className="w-30 h-30 relative z-10"
/>
        </div>
        
        {/* Floating accent elements */}
        <div 
          className="absolute -top-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center animate-bounce"
          style={{ 
            backgroundColor: 'rgb(227, 106, 37)', 
            animationDelay: '0.5s',
            boxShadow: '0 8px 16px rgba(227, 106, 37, 0.4)'
          }}
        >
         <img 
  src={iconPixels} 
  alt="Logo" 
  className="w-30 h-30 relative z-10"
/>
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
        Pixels Juniors Academy
      </h1>
      <p 
        className="text-xl mb-2 font-medium"
        style={{ color: 'rgb(227, 106, 37)' }}
      >
        English & Programming & Robotics for Kids
      </p>
      <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
        Unlock your child's potential in the world of technology and innovation
      </p>
    </div>
  );
}