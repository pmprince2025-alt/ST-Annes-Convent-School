import React from 'react';
import clsx from 'clsx';

const Badge = ({ category, className }) => {
  const getBadgeStyles = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'academic': return 'bg-blue-primary/10 text-blue-dark border-blue-primary/20';
      case 'exam': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'holiday': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'cultural': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'sports': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'events': return 'bg-yellow/10 text-yellow-700 border-yellow/20';
      case 'achievements': return 'bg-blue-deeper/10 text-blue-deeper border-blue-deeper/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-sm transition-all duration-300 hover:scale-105",
      getBadgeStyles(category),
      className
    )}>
      <span className="w-1 h-1 rounded-full bg-current mr-2 opacity-50"></span>
      {category}
    </span>
  );
};

export default Badge;
