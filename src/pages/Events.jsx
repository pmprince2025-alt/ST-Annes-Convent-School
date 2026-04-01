import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import { supabase } from '../lib/supabase';
import { MapPin, Calendar, Clock } from 'lucide-react';

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

    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getImageUrl = (url) => {
    if (!url) return '/event.jpg';
    if (url.startsWith('http')) return url;
    return `/${url}`;
  };

  return (
    <div className="w-full bg-off-white min-h-screen">
      <section className="relative w-full h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/seminar.jpg" alt="Events" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/70"></div>
        </div>
        <h1 className="relative z-10 font-display font-bold text-white text-[48px] animate-fade-up">Events & News</h1>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === cat 
                  ? 'bg-blue-primary text-white shadow-md' 
                  : 'bg-white text-gray-text border border-gray-200 hover:border-blue-primary hover:text-blue-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-light">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-display text-2xl font-bold text-gray-400">No events found</h3>
            <p className="text-gray-text mt-2">Check back later or try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => (
              <Card key={event.id} delay={idx * 50} className="flex flex-col p-0 overflow-hidden group">
                {/* Event Image Cover */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImageUrl(event.cover_image_url)} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Photo Count Badge */}
                  {event.event_photos?.length > 0 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <ImageIcon size={12} className="text-yellow" />
                      +{event.event_photos.length} Photos
                    </div>
                  )}
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg border border-white/20 text-center flex flex-col items-center justify-center min-w-[3.5rem] p-1">
                    <span className="text-red font-bold text-sm uppercase leading-none">{formatDate(event.date, false).month}</span>
                    <span className="font-display font-bold text-2xl text-blue-deeper mt-0.5">{formatDate(event.date, false).day}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <Badge category={event.category} className="self-start mb-3" />
                  <h3 className="font-display font-bold text-xl text-blue-dark mb-4 group-hover:text-blue-primary transition-colors line-clamp-2 leading-snug">
                    {event.title}
                  </h3>
                  {event.description && (
                    <div 
                      className="text-gray-text text-sm mb-6 flex-1 line-clamp-3 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.description }} 
                    />
                  )}
                  
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center text-sm text-gray-mid gap-2 font-medium">
                      <MapPin size={16} className="text-blue-primary" /> {event.venue || 'School Campus'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;
