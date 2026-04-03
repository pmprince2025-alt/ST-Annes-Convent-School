import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import { supabase } from '../lib/supabase';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Upcoming', 'Past', 'Academic', 'Cultural', 'Sports'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, event_photos(id, image_url)')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase.channel('page_events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchEvents())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return new Date(event.date) >= new Date();
    if (filter === 'Past') return new Date(event.date) < new Date();
    return event.category === filter;
  });

  const formatDate = (dateString, long = true) => {
    const d = new Date(dateString);
    if (long) {
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return {
      day: d.getDate(),
      month: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear()
    };
  };

  const getImageUrl = (url) => {
    if (!url) return '/event.jpg';
    if (url.startsWith('http')) return url;
    return `/${url}`;
  };

  return (
    <div className="w-full bg-off-white min-h-screen">
      {/* Page Hero */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/seminar.jpg" alt="Events" className="w-full h-full object-cover scale-110 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/40 to-blue-deeper/90 opacity-90"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-yellow/20 backdrop-blur-md border border-yellow/30 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="font-mono font-bold text-yellow text-[10px] uppercase tracking-[0.3em]">Happenings & News</span>
          </div>
          <h1 className="font-display font-black text-white text-[56px] md:text-[72px] lg:text-[84px] animate-fade-up tracking-tighter leading-none mb-6">
            School <span className="text-yellow">Events</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium animate-fade-up max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '200ms' }}>
            Stay updated with the latest activities, achievements, and upcoming highlights from the ST. Anne's Convent School community.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </section>

      <section className="section-padding bg-off-white relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter Bar */}
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

          {/* Loading / Error / Empty States */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[500px] glass animate-pulse rounded-[2.5rem]"></div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-24 text-center glass rounded-[3rem] border border-dashed border-gray-200">
              <Calendar size={80} className="mx-auto text-gray-200 mb-8" />
              <h3 className="font-display text-3xl font-black text-blue-dark/30 uppercase tracking-tighter">No events match the criteria</h3>
              <p className="text-gray-text mt-4 font-medium">Check back soon for more exciting updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event, idx) => (
                <div key={event.id} className="group relative flex flex-col glass rounded-[2.5rem] border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-blue-primary/5 transition-all duration-500 overflow-hidden hover:-translate-y-2">
                  {/* Event Image Cover */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={getImageUrl(event.cover_image_url)} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-deeper/50 to-transparent"></div>
                    
                    {/* Date Badge */}
                    <div className="absolute top-6 left-6 glass px-4 py-2.5 rounded-2xl border border-white/50 shadow-lg text-center flex flex-col items-center justify-center min-w-[4rem]">
                      <span className="text-blue-primary font-black text-xs uppercase tracking-tighter leading-none">{formatDate(event.date, false).month}</span>
                      <span className="font-display font-black text-3xl text-blue-dark mt-1">{formatDate(event.date, false).day}</span>
                    </div>

                    {/* Photo Count Badge */}
                    {event.event_photos?.length > 0 && (
                      <div className="absolute bottom-6 right-6 glass p-2 rounded-xl text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-white/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse"></div>
                        +{event.event_photos.length} Captured
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <span className="bg-yellow/10 text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-yellow/20">
                         {event.category}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-black text-2xl text-blue-dark mb-6 group-hover:text-blue-primary transition-colors line-clamp-2 leading-tight">
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <div 
                        className="text-gray-text text-sm mb-10 flex-1 line-clamp-3 leading-relaxed font-medium"
                        dangerouslySetInnerHTML={{ __html: event.description }} 
                      />
                    )}
                    
                    <div className="pt-8 border-t border-gray-50 mt-auto flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-400 gap-2 font-bold uppercase tracking-widest">
                        <MapPin size={16} className="text-yellow" /> {event.venue || 'Campus Area'}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-primary/10 flex items-center justify-center text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                         <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
