import React, { useState, useEffect  } from "react";
import { Code, Cpu, Rocket, BookOpen, Award, Trophy, Languages } from "lucide-react";
export default function BackgroundElements() {
      const [floatingElements, setFloatingElements] = useState([]);

    useEffect(()=>{
        const elements =[
      { icon: Code, delay: 0, size: 'w-6 h-6' },
      { icon: Cpu, delay: 1.5, size: 'w-5 h-5' },
      { icon: Rocket, delay: 3, size: 'w-7 h-7' },
      { icon: BookOpen, delay: 4.5, size: 'w-5 h-5' },
      { icon: Award, delay: 6, size: 'w-6 h-6' },
      { icon: Languages, delay: 7.5, size: 'w-6 h-6' },
      { icon: Trophy, delay: 9, size: 'w-5 h-5' }
        ];
        setFloatingElements(elements);
    },[]);
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Elegant geometric patterns */}
      <div 
        className="absolute top-20 left-16 w-32 h-32 border rounded-full animate-pulse"
        style={{ borderColor: 'rgba(227, 106, 37, 0.2)',
                  animationDuration: '3s'
         }}
      ></div>
      <div 
        className="absolute top-40 right-20 w-24 h-24 border rotate-45 animate-spin"
        style={{ 
          borderColor: 'rgba(227, 106, 37, 0.15)',
          animationDuration: '10s' 
        }}
      ></div>
      <div 
        className="absolute bottom-32 left-1/4 w-16 h-16 border rounded-full animate-pulse"
        style={{ 
          borderColor: 'rgba(227, 106, 37, 0.1)',
          animationDelay: '2s' 
        }}
      ></div>
      
      {/* Floating professional icons */}
      {floatingElements.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div 
            key={index}
            className="absolute animate-bounce"
            style={{
              top: `${15 + (index * 10)}%`,
              right: `${8 + (index * 12)}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: '2s',
              color: 'rgba(227, 106, 37, 0.2)'
            }}
          >
            <IconComponent className={item.size} />
          </div>
        );
      })}

      {/* Subtle gradient overlays */}
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: `linear-gradient(135deg, 
            rgba(227, 106, 37, 0.05) 0%, 
            transparent 50%, 
            rgba(227, 106, 37, 0.03) 100%)`
        }}
      ></div>
    </div>
  );
}