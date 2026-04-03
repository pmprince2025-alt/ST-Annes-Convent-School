import React from 'react';
import clsx from 'clsx';

const SectionHeader = ({ label, heading, subtext, className, light = false }) => {
  return (
    <div className={clsx("mb-12 relative group", className)}>
      {label && (
        <div className="flex items-center gap-3 mb-4 animate-fade-up">
          <div className="h-[1px] w-8 bg-yellow/40 group-hover:w-12 transition-all duration-700"></div>
          <p className={clsx(
            "text-[10px] font-black uppercase tracking-[0.4em]",
            light ? "text-yellow/70" : "text-yellow"
          )}>
            {label}
          </p>
        </div>
      )}
      <h2 className={clsx(
        "font-display font-black text-3xl md:text-4xl lg:text-5xl tracking-tighter leading-none mb-6 animate-fade-up",
        light ? "text-white" : "text-blue-deeper"
      )} style={{ animationDelay: '100ms' }}>
        {heading}
      </h2>
      {subtext && (
        <p className={clsx(
          "max-w-2xl text-lg font-medium leading-relaxed animate-fade-up opacity-60",
          light ? "text-white" : "text-gray-text"
        )} style={{ animationDelay: '200ms' }}>
          {subtext}
        </p>
      )}
      <div className={clsx(
        "h-1.5 w-20 rounded-full mt-8 animate-fade-up transition-all duration-700 group-hover:w-32",
        light ? "bg-yellow/40" : "bg-blue-primary/10"
      )} style={{ animationDelay: '300ms' }}>
        <div className="h-full w-1/2 bg-yellow rounded-full"></div>
      </div>
    </div>
  );
};

export default SectionHeader;
