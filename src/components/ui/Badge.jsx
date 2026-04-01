import React from 'react';
import clsx from 'clsx';

const Badge = ({ category, className }) => {
  const getBadgeColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'academic': return 'badge-academic';
      case 'exam': return 'badge-exam';
      case 'holiday': return 'badge-holiday';
      case 'cultural': return 'badge-cultural';
      case 'sports': return 'badge-sports';
      case 'general':
      case 'other':
      default: return 'badge-general';
    }
  };

  return (
    <span className={clsx("badge", getBadgeColor(category), className)}>
      {category}
    </span>
  );
};

export default Badge;
