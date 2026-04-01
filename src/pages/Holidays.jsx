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
    <div className="w-full bg-off-white min-h-screen pb-20">
      <section className="relative w-full h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/seminar.jpg" alt="Holidays" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/75"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display font-bold text-white text-[40px] md:text-[56px] animate-fade-up">Tentative Holiday &</h1>
          <p className="text-yellow font-medium tracking-widest uppercase text-sm mt-0 md:-mt-2 animate-fade-up" style={{ animationDelay: '200ms' }}>
            Programme List 2026-27
          </p>
        </div>
      </section>

      <section className="section-padding max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6 sm:gap-8">
          <SectionHeader 
            className="!mb-0"
            label="Plan Ahead" 
            heading={<><CalendarCheck className="inline-block mr-3 text-blue-primary relative -top-1" size={32} />Annual Holidays</>} 
            subtext="Stay informed about upcoming school holidays, festivals, and special programmes."
          />
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-light flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-text">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Holiday</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Programme</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-3xl h-[300px] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MONTHS.map((m, idx) => {
              const key = `${m.name} ${m.year}`;
              const monthEvents = groupedData[key] || [];
              const isExpanded = expandedMonths[key];
              const displayedEvents = isExpanded ? monthEvents : monthEvents.slice(0, 3);
              const hasMore = monthEvents.length > 3;

              return (
                <Card 
                  key={key} 
                  delay={idx * 50} 
                  className="flex flex-col p-0 overflow-hidden group border border-gray-light bg-white rounded-3xl hover:shadow-xl transition-all duration-500"
                >
                  <header className="px-7 py-6 bg-blue-primary/5 border-b border-gray-light flex items-center justify-between group-hover:bg-blue-primary transition-colors duration-500">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center font-black group-hover:scale-110 transition-transform duration-500">
                        <span className="text-[10px] text-blue-primary uppercase leading-none">{m.name.substring(0, 3)}</span>
                        <span className="text-xl text-blue-dark">{m.year.toString().slice(-2)}</span>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-2xl text-blue-dark group-hover:text-white transition-colors duration-500">{m.name}</h3>
                        <p className="text-[10px] font-black text-gray-mid group-hover:text-white/60 uppercase tracking-widest transition-colors duration-500">{m.year}</p>
                      </div>
                    </div>
                    <Calendar className="text-blue-primary group-hover:text-white transition-colors duration-500 opacity-20" size={32} />
                  </header>

                  <div className="p-5 sm:p-7 space-y-4 flex-1">
                    {monthEvents.length > 0 ? (
                      <>
                        <div className="space-y-4">
                          {displayedEvents.map((event) => (
                            <div key={event.id} className="flex gap-4 group/item">
                              <div className={clsx(
                                "w-10 h-10 rounded-lg shrink-0 flex flex-col items-center justify-center font-bold text-sm shadow-sm",
                                event.type === 'Holiday' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                              )}>
                                {new Date(event.date).getUTCDate()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-blue-dark leading-tight group-hover/item:text-blue-primary transition-colors">{event.title}</h4>
                                {event.description && <p className="text-gray-text text-xs mt-1 line-clamp-1">{event.description}</p>}
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className={clsx(
                                    "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                                    event.type === 'Holiday' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                  )}>
                                    {event.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {hasMore && (
                          <button
                            onClick={() => toggleMonth(key)}
                            className="w-full mt-2 py-2 text-xs font-bold uppercase tracking-wider text-blue-primary hover:text-blue-dark transition-colors flex items-center justify-center gap-1 border border-dashed border-blue-primary/30 rounded-xl hover:bg-blue-primary/5"
                          >
                            {isExpanded ? 'Show Less' : `Show More (+${monthEvents.length - 3})`}
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-10 opacity-30">
                        <Info size={40} className="mb-2" />
                        <p className="text-xs font-bold uppercase tracking-widest">No scheduled events</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Holidays;
