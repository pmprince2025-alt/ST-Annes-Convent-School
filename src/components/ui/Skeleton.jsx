import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({ className }) => {
  return (
    <div className={clsx("animate-pulse bg-gray-200 rounded", className)}></div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-light rounded-[10px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border-t-[3px] border-t-gray-300">
      <Skeleton className="h-6 w-24 rounded-full mb-4" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/4 mb-3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-2" />
    </div>
  );
};
