import React from 'react';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';

const Card = ({ children, className, delay = 0, hoverable = true }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={clsx(
        "bg-white border text-left border-gray-light rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border-t-[3px] border-t-blue-primary animate-on-scroll",
        inView && "in-view",
        hoverable && "hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(15,61,110,0.12)] transition-all duration-250",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
