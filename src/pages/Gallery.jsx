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
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/tree-plantation.jpg" alt="Gallery" className="w-full h-full object-cover scale-110 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/40 to-blue-deeper/90 opacity-90"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="font-mono font-bold text-yellow text-[10px] uppercase tracking-[0.3em]">Capturing Memories</span>
          </div>
          <h1 className="font-display font-black text-white text-[56px] md:text-[72px] lg:text-[84px] animate-fade-up tracking-tighter leading-none mb-6">
            Visual <span className="text-yellow">Gallery</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium animate-fade-up max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '200ms' }}>
            A glimpse into the daily life, achievements, and vibrant environment at ST. Anne's Convent School.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </section>

      <section className="section-padding bg-off-white relative isolate overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-16 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={clsx(
                  "px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                  filter === cat 
                    ? "bg-blue-primary text-white shadow-xl shadow-blue-primary/20 scale-105" 
                    : "glass text-gray-text hover:bg-white hover:text-blue-primary border-white/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {loading ? (
               Array(6).fill(0).map((_, i) => (
                 <div key={i} className={clsx("w-full glass animate-pulse rounded-[2.5rem]", i % 2 === 0 ? "h-64" : "h-96")}></div>
               ))
            ) : filteredPhotos?.length > 0 ? (
              filteredPhotos.map((photo, i) => (
                <div 
                  key={photo.id} 
                  onClick={() => setIndex(i)}
                  className="group relative w-full rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 break-inside-avoid cursor-pointer animate-fade-up border border-white/50 bg-white"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <img 
                    src={getImageUrl(photo.image_url)} 
                    alt={photo.title} 
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-deeper/90 via-blue-deeper/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <span className="inline-block bg-yellow/20 backdrop-blur-md border border-yellow/30 px-3 py-1 rounded-lg text-[10px] font-black text-yellow uppercase tracking-widest mb-3">
                        {photo.category}
                      </span>
                      <h3 className="text-white font-display font-black text-2xl leading-tight">
                        {photo.title}
                      </h3>
                      <div className="w-10 h-1 bg-yellow mt-4 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Subtle border overlay */}
                  <div className="absolute inset-0 border-[8px] border-white/0 group-hover:border-white/10 transition-all duration-500 pointer-events-none rounded-[2.5rem]"></div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center glass rounded-[3rem] border border-dashed border-gray-200">
                <div className="opacity-20 mb-6">
                   <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                </div>
                <h3 className="font-display text-2xl font-black text-blue-dark/30 uppercase tracking-tighter">No visuals discovered yet</h3>
                <p className="text-gray-text mt-4 font-medium">Be the first to see our new additions.</p>
              </div>
            )}
          </div>
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
