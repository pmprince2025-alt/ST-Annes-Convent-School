import React, { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { useSupabaseQuery } from '../hooks/useSupabase';
import clsx from 'clsx';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [index, setIndex] = useState(-1);

  const categories = ['All', 'Events', 'Achievements', 'Classroom', 'Others'];
  const { data: galleryData, loading } = useSupabaseQuery('gallery', { orderBy: 'created_at', ascending: false });

  const filteredPhotos = filter === 'All' ? galleryData : galleryData?.filter(p => p.category === filter);
  
  const getImageUrl = (url) => {
    if (!url) return '/gallery.jpg';
    if (url.startsWith('http')) return url;
    return `/${url}`;
  };

  // Format for lightbox
  const slides = filteredPhotos ? filteredPhotos.map(p => ({
    src: getImageUrl(p.image_url),
    title: p.title,
    description: p.category
  })) : [];

  return (
    <div className="w-full bg-off-white min-h-screen">
      {/* Page Hero */}
      <section className="relative w-full h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/tree-plantation.jpg" alt="Gallery" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/70"></div>
        </div>
        <h1 className="relative z-10 font-display font-bold text-white text-[48px] animate-fade-up">Photo Gallery</h1>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={clsx(
                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm",
                filter === cat 
                  ? "bg-blue-primary text-white scale-105 shadow-md border border-transparent" 
                  : "bg-white text-gray-text border border-gray-lighter hover:border-blue-primary hover:text-blue-dark"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
          {loading ? (
             Array(6).fill(0).map((_, i) => (
               <div key={i} className={clsx("w-full bg-gray-200 animate-pulse rounded-2xl", i % 2 === 0 ? "h-64" : "h-96")}></div>
             ))
          ) : filteredPhotos?.length > 0 ? (
            filteredPhotos.map((photo, i) => (
              <div 
                key={photo.id} 
                onClick={() => setIndex(i)}
                className="group relative w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 break-inside-avoid cursor-pointer animate-fade-up border border-gray-200"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <img 
                  src={getImageUrl(photo.image_url)} 
                  alt={photo.title} 
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700" 
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-deeper/90 via-blue-deeper/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-yellow text-xs font-bold uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    {photo.category}
                  </span>
                  <h3 className="text-white font-display font-medium text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out delay-75">
                    {photo.title}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-gray-light">
              <h3 className="font-display text-2xl font-bold text-gray-400">No photos found</h3>
              <p className="text-gray-text mt-2">Try selecting a different category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Integration */}
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </div>
  );
};

export default Gallery;
