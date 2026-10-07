import React from 'react';

export default function HeroHeader({ title, subtitle, image }) {
  return (
    <div className="medical-header">
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div className="medical-header-overlay">
        <h1 className="text-4xl font-black tracking-tight mb-2 drop-shadow-lg">{title}</h1>
        <p className="text-blue-100/90 text-lg font-medium drop-shadow-md max-w-2xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
