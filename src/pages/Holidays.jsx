import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Calendar, CalendarCheck, Info } from 'lucide-react';
import clsx from 'clsx';

const MONTHS = [
  { name: 'March', year: 2026 },
  { name: 'April', year: 2026 },
  { name: 'May', year: 2026 },
  { name: 'June', year: 2026 },
  { name: 'July', year: 2026 },
  { name: 'August', year: 2026 },
  { name: 'September', year: 2026 },
  { name: 'October', year: 2026 },
  { name: 'November', year: 2026 },
  { name: 'December', year: 2026 },
  { name: 'January', year: 2027 },
  { name: 'February', year: 2027 },
  { name: 'March', year: 2027 },
];

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMonths, setExpandedMonths] = useState({});

  const toggleMonth = (monthKey) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }));
  };

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: true });
      
      if (error) throw error;
      setHolidays(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();

    const channel = supabase.channel('page_holidays')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'holidays' }, () => fetchHolidays())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const groupHolidaysByMonth = () => {
    const grouped = {};
    MONTHS.forEach(m => {
      const key = `${m.name} ${m.year}`;
      grouped[key] = holidays.filter(h => {
        const d = new Date(h.date);
        const monthName = d.toLocaleString('default', { month: 'long' });
        const year = d.getFullYear();
        return monthName === m.name && year === m.year;
      });
    });
    return grouped;
  };

  const groupedData = groupHolidaysByMonth();

  return (
    <div className="w-full bg-off-white min-h-screen">
      {/* Page Hero */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/seminar.jpg" alt="Holidays" className="w-full h-full object-cover scale-110 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/50 to-blue-deeper/90 opacity-90"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="font-mono font-bold text-yellow text-[10px] uppercase tracking-[0.3em]">Plan Your Year</span>
          </div>
          <h1 className="font-display font-black text-white text-[56px] md:text-[72px] lg:text-[84px] animate-fade-up tracking-tighter leading-none mb-6">
            Holiday <span className="text-yellow">Calendar</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium animate-fade-up max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '200ms' }}>
            Academic year 2026-27 tentative schedule for holidays, festivals, and school programmes.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </section>

      <section className="section-padding bg-off-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
            <SectionHeader 
              className="!mb-0"
              label="Annual Schedule" 
              heading={<><CalendarCheck className="inline-block mr-4 text-blue-primary" size={40} />Calendar of Events</>} 
              subtext="Comprehensive list of important dates for smooth planning."
            />
            <div className="glass p-6 rounded-[2rem] border border-white/50 flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-dark shadow-xl">
              <span className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/20"></span> Holiday marker</span>
              <div className="w-px h-4 bg-gray-200"></div>
              <span className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></span> Programme marker</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Array(6).fill(0).map((_, i) => <div key={i} className="h-80 glass animate-pulse rounded-[2.5rem]"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {MONTHS.map((m, idx) => {
                const key = `${m.name} ${m.year}`;
                const monthEvents = groupedData[key] || [];
                const isExpanded = expandedMonths[key];
                const displayedEvents = isExpanded ? monthEvents : monthEvents.slice(0, 3);
                const hasMore = monthEvents.length > 3;

                return (
                  <div 
                    key={idx} 
                    className="group flex flex-col glass rounded-[2.5rem] border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-blue-primary/5 transition-all duration-500 overflow-hidden hover:-translate-y-2 animate-fade-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <header className="px-8 py-8 bg-blue-primary/5 border-b border-white/50 flex items-center justify-between group-hover:bg-blue-primary transition-all duration-500">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-blue-primary/10 flex flex-col items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <span className="text-[10px] text-blue-primary uppercase leading-none mb-1">{m.name.substring(0, 3)}</span>
                          <span className="text-2xl text-blue-dark leading-none">{m.year.toString().slice(-2)}</span>
                        </div>
                        <div>
                          <h3 className="font-display font-black text-3xl text-blue-dark group-hover:text-white transition-colors duration-500">{m.name}</h3>
                          <p className="text-[10px] font-black text-blue-primary/60 group-hover:text-white/60 uppercase tracking-[0.2em] transition-colors duration-500">{m.year}</p>
                        </div>
                      </div>
                      <Calendar className="text-blue-primary group-hover:text-white transition-all duration-500 opacity-20 group-hover:opacity-40 -rotate-12 group-hover:rotate-0" size={40} />
                    </header>

                    <div className="p-8 space-y-6 flex-1">
                      {monthEvents.length > 0 ? (
                        <>
                          <div className="space-y-6">
                            {displayedEvents.map((event) => (
                              <div key={event.id} className="flex gap-5 group/item py-1">
                                <div className={clsx(
                                  "w-12 h-12 rounded-2xl shrink-0 flex flex-col items-center justify-center font-black text-lg shadow-xl shadow-opacity-30 group-hover/item:scale-110 transition-transform",
                                  event.type === 'Holiday' 
                                    ? 'bg-red-500 text-white shadow-red-500/20' 
                                    : 'bg-emerald-500 text-white shadow-emerald-500/20'
                                )}>
                                  {new Date(event.date).getUTCDate()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-black text-blue-dark leading-snug group-hover/item:text-blue-primary transition-colors text-[17px] mb-1">{event.title}</h4>
                                  <div className="flex items-center gap-3">
                                     <span className={clsx(
                                       "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border",
                                       event.type === 'Holiday' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                     )}>
                                       {event.type}
                                     </span>
                                     {event.description && <span className="text-gray-400 text-xs font-medium truncate">• {event.description}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {hasMore && (
                            <button
                              onClick={() => toggleMonth(key)}
                              className="w-full mt-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-primary hover:text-white transition-all flex items-center justify-center gap-2 border-2 border-dashed border-blue-primary/20 rounded-2xl hover:bg-blue-primary hover:border-blue-primary shadow-sm hover:shadow-xl hover:shadow-blue-primary/20"
                            >
                              {isExpanded ? 'View Less' : `View More (+${monthEvents.length - 3})`}
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center py-16 opacity-30">
                          <Info size={48} className="mb-4 text-blue-primary" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-dark text-center">No highlights scheduled</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Holidays;
