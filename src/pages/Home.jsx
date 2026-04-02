import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { supabase } from '../lib/supabase';
import { ChevronDown, ArrowRight, FileText, CalendarDays, ImageIcon, Phone } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import clsx from 'clsx';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats bar animation trigger
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [noticesRes, eventsRes, galleryRes, holidaysRes] = await Promise.all([
          supabase.from('notices').select('*').eq('published', true).order('date', { ascending: false }).limit(3),
          supabase.from('events').select('*').order('date', { ascending: true }).limit(3),
          supabase.from('gallery').select('*').order('created_at', { ascending: false }).limit(6),
          supabase.from('holidays').select('*').eq('published', true).order('date', { ascending: true })
        ]);
        
        if (noticesRes.data) setNotices(noticesRes.data);
        if (eventsRes.data) setEvents(eventsRes.data);
        if (galleryRes.data) setGallery(galleryRes.data);
        if (holidaysRes.data) {
          const now = new Date();
          const currentMonthHolidays = holidaysRes.data.filter(h => {
             const d = new Date(h.date);
             return d.getUTCMonth() === now.getUTCMonth() && d.getUTCFullYear() === now.getUTCFullYear();
          });
          setHolidays(currentMonthHolidays);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();

    // Supabase Realtime subscriptions
    const noticeSub = supabase.channel('home_notices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => fetchHomeData())
      .subscribe();
      
    const eventsSub = supabase.channel('home_events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchHomeData())
      .subscribe();

    return () => {
      supabase.removeChannel(noticeSub);
      supabase.removeChannel(eventsSub);
    };
  }, []);

  const formatDate = (dateString, showMonth = false) => {
    const date = new Date(dateString);
    if (showMonth) {
      return { 
        day: date.getDate(), 
        month: date.toLocaleDateString('en-US', { month: 'short' }) 
      };
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[100dvh] min-h-[600px] flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="ST. Anne's Convent School" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/60"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center mt-16">
          <h1 className="font-display font-extrabold text-white text-[48px] md:text-[72px] leading-tight mb-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
            ST. Anne's Convent School
          </h1>
          <p className="font-body text-yellow text-xl md:text-2xl mb-8 animate-fade-up" style={{ animationDelay: '400ms' }}>
            Sonepur, Odisha
          </p>
          <div className="inline-block bg-yellow px-5 py-2 rounded-full mb-10 animate-fade-up shadow-lg" style={{ animationDelay: '500ms' }}>
            <span className="font-body font-semibold text-blue-deeper text-sm tracking-widest">
              ✦ EXPLORE · EXPERIMENT · EXCEL ✦
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '600ms' }}>
            <button 
              onClick={() => document.getElementById('stats-bar').scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary w-full sm:w-auto"
            >
              Explore Our School
            </button>
            <Link to="/notices" className="btn-secondary w-full sm:w-auto text-center">
              View Notices
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white cursor-pointer z-10" onClick={() => document.getElementById('stats-bar').scrollIntoView({ behavior: 'smooth' })}>
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Stats Bar */}
      <section id="stats-bar" ref={statsRef} className="bg-blue-primary py-12 border-t-4 border-yellow z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-x-0 md:divide-x border-white/20">
            <div className="text-center md:px-6">
              <div className="font-display font-bold text-4xl text-white mb-2">
                {statsInView ? '30' : '0'}
              </div>
              <p className="font-body font-medium text-sm text-yellow uppercase tracking-wider">Years of Excellence</p>
            </div>
            <div className="text-center md:px-6">
              <div className="font-display font-bold text-4xl text-white mb-2">
                {statsInView ? '500+' : '0'}
              </div>
              <p className="font-body font-medium text-sm text-yellow uppercase tracking-wider">Students Enrolled</p>
            </div>
            <div className="text-center md:px-6">
              <div className="font-display font-bold text-4xl text-white mb-2">
                {statsInView ? '25' : '0'}
              </div>
              <p className="font-body font-medium text-sm text-yellow uppercase tracking-wider">Qualified Teachers</p>
            </div>
            <div className="text-center md:px-6">
              <div className="font-display font-bold text-4xl text-white mb-2">
                {statsInView ? '100+' : '0'}
              </div>
              <p className="font-body font-medium text-sm text-yellow uppercase tracking-wider">Achievements</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="section-padding bg-off-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div 
            ref={aboutRef}
            className={clsx("relative rounded-2xl overflow-hidden shadow-2xl animate-on-scroll", aboutInView && "in-view")}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-dark/40 to-transparent z-10"></div>
            <img src="/classroom.jpg" alt="Students in Classroom" className="w-full h-full object-cover aspect-[4/3] rounded-2xl" />
            <div className="absolute bottom-6 left-6 z-20 bg-white shadow-xl rounded-lg p-5 border-l-4 border-yellow max-w-[280px]">
              <p className="font-display font-bold text-blue-dark text-xl mb-1">Empowering Minds</p>
              <p className="text-gray-text text-sm">Building a foundation for lifelong learning and success.</p>
            </div>
          </div>
          
          <div className={clsx("animate-on-scroll", aboutInView && "in-view")} style={{ transitionDelay: '200ms' }}>
            <SectionHeader 
              label="Our School" 
              heading="About ST. Anne's" 
              subtext="Welcome to ST. Anne's Convent School. We strive to provide a nurturing environment where every child can explore their potential, experiment with new ideas, and excel in all their endeavors."
            />
            <Link to="/about" className="inline-flex items-center gap-2 text-blue-primary font-semibold hover:text-blue-dark hover:gap-3 transition-all">
              Learn More <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      <section className="section-padding bg-white border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <SectionHeader 
              className="!mb-0"
              label="Stay Updated" 
              heading={<><FileText className="inline-block mr-3 text-blue-primary relative -top-1" size={32} />Latest Notices</>} 
              subtext="Important announcements and updates for students and parents."
            />
            <Link to="/notices" className="btn-secondary bg-blue-primary border-transparent hover:bg-blue-dark shrink-0">
              View All Notices →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : notices.length > 0 ? (
              notices.map((notice, idx) => (
                <Card key={notice.id} delay={idx * 100} className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <Badge category={notice.category} />
                    <span className="text-sm font-mono text-gray-mid shrink-0">
                      {formatDate(notice.date)}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-blue-dark mb-3 leading-snug">{notice.title}</h3>
                  <p className="text-gray-text text-[15px] line-clamp-3 mb-6 flex-grow">{notice.description}</p>
                  {notice.pdf_url && (
                    <a href={notice.pdf_url} className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-blue-primary hover:text-blue-dark">
                      <FileText size={16} /> Download PDF
                    </a>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-mid">No notices at the moment.</div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-off-white border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <SectionHeader 
              className="!mb-0"
              label="Join Us" 
              heading={<><CalendarDays className="inline-block mr-3 text-blue-primary relative -top-1" size={32} />Upcoming Events</>} 
              subtext="Mark your calendars for our exciting school activities."
            />
            <Link to="/events" className="btn-secondary bg-blue-primary border-transparent hover:bg-blue-dark shrink-0">
              View All Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : events.length > 0 ? (
              events.map((event, idx) => {
                const dateParts = formatDate(event.date, true);
                return (
                  <Card key={event.id} delay={idx * 100} hoverable={false} className="flex gap-5 hover:-translate-y-1 transition-transform">
                    <div className="w-16 h-20 shrink-0 bg-blue-100 rounded-lg border border-blue-200 flex flex-col items-center justify-center text-center overflow-hidden">
                      <span className="bg-blue-primary w-full text-white text-[11px] font-bold uppercase py-0.5 tracking-wider">{dateParts.month}</span>
                      <span className="font-display font-bold text-2xl text-blue-dark pt-1 pb-1">{dateParts.day}</span>
                    </div>
                    <div className="flex flex-col items-start justify-center flex-1 min-w-0">
                      <Badge category={event.category} className="mb-2 !text-[10px] !px-2 !py-0.5" />
                      <h3 className="font-bold text-lg text-blue-dark leading-tight mb-1 truncate w-full">{event.title}</h3>
                      <p className="text-gray-text text-sm flex items-center gap-2 truncate w-full">
                         {event.venue || 'School Campus'}
                      </p>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-mid">No upcoming events right now.</div>
            )}
          </div>
        </div>
      </section>
      
      {/* Tentative Holiday & Programme Highlights */}
      <section className="section-padding bg-white border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <SectionHeader 
              className="!mb-0"
              label="Calendar" 
              heading={<><CalendarDays className="inline-block mr-3 text-blue-primary relative -top-1" size={32} />This Month's Holidays</>} 
              subtext="Glimpse of holidays and programmes for the current month."
            />
            <Link to="/holidays" className="btn-secondary bg-blue-primary border-transparent hover:bg-blue-dark shrink-0">
              View Full Calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>)
            ) : holidays.length > 0 ? (
              holidays.map((holiday, idx) => (
                <div key={holiday.id} className={clsx(
                  "p-6 rounded-2xl border transition-all flex flex-col justify-center items-center text-center",
                  holiday.type === 'Holiday' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'
                )}>
                  <div className={clsx(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-3 shadow-md",
                    holiday.type === 'Holiday' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  )}>
                    {new Date(holiday.date).getUTCDate()}
                  </div>
                  <h4 className="font-bold text-blue-dark leading-tight mb-1">{holiday.title}</h4>
                  <p className={clsx(
                    "text-[10px] font-black uppercase tracking-widest",
                    holiday.type === 'Holiday' ? 'text-red-500' : 'text-emerald-600'
                  )}>{holiday.type}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-light bg-off-white rounded-2xl">
                <CalendarDays className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-mid font-bold uppercase tracking-widest text-sm">No holidays remaining this month</p>
                <Link to="/holidays" className="mt-4 text-blue-primary font-bold hover:underline">Check full calendar</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section-padding bg-white border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            label="Visuals" 
            heading={<><ImageIcon className="inline-block mr-3 text-blue-primary relative -top-1" size={32} />Gallery Preview</>} 
            subtext="Glimpses of life at ST. Anne's."
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mb-12">
            {loading ? (
               Array(6).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-xl"></div>)
            ) : gallery.length > 0 ? (
              gallery.map((photo, idx) => (
                <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <img 
                    src={`/${photo.image_url}`} 
                    alt={photo.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-deeper/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <p className="text-white font-medium truncate">{photo.title}</p>
                  </div>
                </div>
              ))
            ) : (
               <div className="col-span-full py-12 text-center text-gray-mid">Gallery empty.</div>
            )}
          </div>
          
          <div className="text-center">
            <Link to="/gallery" className="btn-secondary bg-blue-primary border-transparent hover:bg-blue-dark inline-flex items-center justify-center">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-blue-deeper py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-white text-3xl mb-4">Have questions? We're here to help.</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-300 font-medium">
              <span className="flex items-center gap-2 mt-2 md:mt-0"><CalendarDays size={18} className="text-yellow" /> Mon–Sat, 8am–2pm</span>
              <span className="flex items-center gap-2"><Phone size={18} className="text-yellow" /> 06654221118</span>
            </div>
          </div>
          <Link to="/contact" className="btn-primary hover:bg-white hover:text-blue-deeper shadow-xl whitespace-nowrap px-8 py-4 text-[16px]">
            Get In Touch →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
