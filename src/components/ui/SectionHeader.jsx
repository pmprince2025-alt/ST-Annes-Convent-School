import React from 'react';
import clsx from 'clsx';

const SectionHeader = ({ label, heading, subtext, className }) => {
  return (
    <div className={clsx("mb-12", className)}>
      {label && <p className="section-label">✦ {label}</p>}
      <h2 className="section-heading">{heading}</h2>
      {subtext && <p className="section-subtext">{subtext}</p>}
    </div>
  );
};

export default SectionHeader;
