import React from 'react';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';

const Card = ({ children, className, delay = 0, hoverable = true, variant = 'glass' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={clsx(
        "relative overflow-hidden rounded-3xl transition-all duration-500 md:duration-700 p-6",
        variant === 'glass' && "glass border border-white scroll-mt-24 shadow-2xl",
        variant === 'blue' && "bg-blue-deeper text-white shadow-2xl",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 md:translate-y-8",
        hoverable && "hover:scale-[1.02] hover:shadow-blue-primary/10",
        className
      )}
    >
      {/* Decorative accent for glass variant */}
      {variant === 'glass' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-primary/20 via-yellow/40 to-blue-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}
      {children}
    </div>
  );
};

export default Card;
