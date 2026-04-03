import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { supabase } from '../lib/supabase';
import { ChevronDown, ArrowRight, FileText, CalendarDays, ImageIcon, Phone, MapPin } from 'lucide-react';
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
      <section className="relative w-full h-[100dvh] min-h-[700px] flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="ST. Anne's Convent School" className="w-full h-full object-cover scale-105 animate-float" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/40 to-blue-deeper/90 opacity-80"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 animate-fade-up border border-white/10" style={{ animationDelay: '100ms' }}>
            <span className="w-2 h-2 rounded-full bg-yellow animate-pulse"></span>
            <span className="font-body font-bold text-white text-[10px] uppercase tracking-[0.3em]">
              Admissions Open 2026-27
            </span>
          </div>

          <h1 className="font-display font-black text-white text-[48px] md:text-[64px] lg:text-[80px] leading-[1.05] mb-6 animate-fade-up tracking-tight" style={{ animationDelay: '300ms' }}>
            ST. Anne's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow via-yellow/80 to-yellow">Convent School</span>
          </h1>
          
          <p className="font-body text-white/80 text-lg md:text-2xl max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: '500ms' }}>
            A legacy of excellence in Sonepur, Odisha. We nurture curiosity, foster innovation, and build foundations for life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '700ms' }}>
            <button 
              onClick={() => document.getElementById('stats-bar').scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary w-full sm:w-auto text-[16px] px-10 py-4 group"
            >
              Learn More <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <Link to="/notices" className="btn-secondary w-full sm:w-auto text-[16px] px-10 py-4">
              Latest Notices
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/50 hover:text-white transition-colors cursor-pointer z-10" onClick={() => document.getElementById('stats-bar').scrollIntoView({ behavior: 'smooth' })}>
          <ChevronDown size={40} strokeWidth={1} />
        </div>
        
        {/* Decorative corner element */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-off-white to-transparent"></div>
      </section>

      {/* Stats Bar */}
      <section id="stats-bar" ref={statsRef} className="relative z-20 -mt-8 mb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="glass-dark rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              <div className="text-center group">
                <div className="font-display font-black text-4xl md:text-5xl text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">
                  {statsInView ? <CountUp.default end={30} duration={2.5} /> : '0'}
                </div>
                <p className="font-mono font-bold text-[10px] text-yellow uppercase tracking-[0.2em] opacity-80">Years of History</p>
              </div>
              <div className="text-center group">
                <div className="font-display font-black text-4xl md:text-5xl text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">
                  {statsInView ? <CountUp.default end={750} suffix="+" duration={2.5} /> : '0'}
                </div>
                <p className="font-mono font-bold text-[10px] text-yellow uppercase tracking-[0.2em] opacity-80">Brilliant Students</p>
              </div>
              <div className="text-center group">
                <div className="font-display font-black text-4xl md:text-5xl text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">
                  {statsInView ? <CountUp.default end={45} duration={2.5} /> : '0'}
                </div>
                <p className="font-mono font-bold text-[10px] text-yellow uppercase tracking-[0.2em] opacity-80">Expert Educators</p>
              </div>
              <div className="text-center group">
                <div className="font-display font-black text-4xl md:text-5xl text-white mb-2 tracking-tighter group-hover:scale-110 transition-transform">
                  {statsInView ? <CountUp.default end={100} suffix="%" duration={2.5} /> : '0'}
                </div>
                <p className="font-mono font-bold text-[10px] text-yellow uppercase tracking-[0.2em] opacity-80">Result Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="section-padding bg-off-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-primary/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div 
            ref={aboutRef}
            className={clsx("relative group animate-on-scroll", aboutInView && "in-view")}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-deeper/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500 md:duration-700"></div>
              <img src="/classroom.jpg" alt="ST. Anne's Students" className="w-full h-full object-cover aspect-[4/3] scale-100 group-hover:scale-110 transition-transform duration-700 md:duration-1000" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 z-20 glass p-6 rounded-2xl shadow-2xl max-w-[280px] border border-white/20 animate-float">
              <div className="w-12 h-12 bg-blue-primary/10 rounded-xl flex items-center justify-center text-blue-primary mb-4">
                <FileText size={24} />
              </div>
              <p className="font-display font-black text-blue-dark text-xl mb-1">Empowering Minds</p>
              <p className="text-gray-text text-sm leading-relaxed">Building a foundation for excellence and lifelong learning since 1994.</p>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
          
          <div className={clsx("animate-on-scroll", aboutInView && "in-view")} style={{ transitionDelay: '200ms' }}>
            <SectionHeader 
              label="Our Legacy" 
              heading="About ST. Anne's" 
              subtext="ST. Anne's Convent School is dedicated to providing a transformative educational experience. We nurture potential, celebrate diversity, and prepare students for a global future."
            />
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-primary/10 flex items-center justify-center text-blue-primary shrink-0">
                  <span className="font-bold">01</span>
                </div>
                <div>
                   <h4 className="font-bold text-blue-dark mb-1">Holistic Development</h4>
                   <p className="text-sm text-gray-text">Focusing on academic, physical, and emotional growth.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow/20 flex items-center justify-center text-amber-700 shrink-0">
                  <span className="font-bold">02</span>
                </div>
                <div>
                   <h4 className="font-bold text-blue-dark mb-1">Modern Infrastructure</h4>
                   <p className="text-sm text-gray-text">State-of-the-art labs and interactive learning spaces.</p>
                </div>
              </div>
            </div>
            <Link to="/about" className="btn-primary inline-flex items-center gap-3 group">
              Discover Our Story <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Notices */}
      <section className="section-padding bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <SectionHeader 
              className="!mb-0"
              label="Information Hub" 
              heading={<><FileText className="inline-block mr-4 text-blue-primary" size={40} />Latest Notices</>} 
              subtext="Essential updates and official announcements for our school community."
            />
            <Link to="/notices" className="group flex items-center gap-3 font-bold text-blue-primary hover:text-blue-dark transition-colors">
              Explore All Announcements
              <div className="w-10 h-10 rounded-full border border-blue-primary/20 flex items-center justify-center group-hover:bg-blue-primary group-hover:text-white transition-all">
                <ArrowRight size={18} />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : notices.length > 0 ? (
              notices.map((notice, idx) => (
                <Card 
                  key={notice.id} 
                  delay={idx * 100} 
                  className="flex flex-col h-full group hover:shadow-2xl transition-all border-none bg-off-white/50"
                  variant="glass"
                >
                  <div className="flex items-center justify-between mb-6">
                    <Badge category={notice.category} />
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                      <CalendarDays size={12} />
                      {formatDate(notice.date)}
                    </div>
                  </div>
                  <h3 className="font-display font-black text-2xl text-blue-dark mb-4 leading-tight group-hover:text-blue-primary transition-colors">{notice.title}</h3>
                  <p className="text-gray-text text-[15px] line-clamp-3 mb-8 leading-relaxed">{notice.description}</p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    {notice.pdf_url ? (
                      <a href={notice.pdf_url} className="inline-flex items-center gap-2 text-sm font-bold text-blue-primary hover:underline">
                        <FileText size={16} /> Download Circular
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-widest italic">Digital Notice</span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-blue-primary/5 flex items-center justify-center text-blue-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-gray-200">
                <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">No recent notices found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding bg-blue-deeper relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <SectionHeader 
              className="!mb-0"
              dark
              label="Coming Up" 
              heading={<><CalendarDays className="inline-block mr-4 text-yellow" size={40} />School Events</>} 
              subtext="Exciting activities and festivals on our horizon."
            />
            <Link to="/events" className="btn-primary !bg-white !text-blue-deeper hover:!bg-yellow transition-all">
              Full Event Calendar
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
            ) : events.length > 0 ? (
              events.map((event, idx) => {
                const dateParts = formatDate(event.date, true);
                return (
                  <div key={event.id} className="group relative glass p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-20 shrink-0 glass shadow-2xl rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden border border-white/20">
                        <span className="bg-yellow w-full text-blue-deeper text-[10px] font-black uppercase py-0.5 tracking-tighter">{dateParts.month}</span>
                        <span className="font-display font-black text-3xl text-white py-1">{dateParts.day}</span>
                      </div>
                      <div className="min-w-0">
                        <Badge category={event.category} className="mb-3 !bg-blue-primary/20 !text-blue-light !border-blue-primary/40" />
                        <h3 className="font-display font-bold text-2xl text-white leading-tight mb-2 truncate">{event.title}</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                           <MapPin size={14} className="text-yellow" /> {event.venue || 'School Campus'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-3xl border border-white/5">
                <CalendarDays size={48} className="mx-auto text-white/10 mb-4" />
                <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-sm">No upcoming events listed</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Holidays Preview */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            label="Current Month" 
            heading="Holidays & Closures" 
            subtext="Stay aware of scheduled breaks and public holidays for the ongoing month."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-off-white animate-pulse rounded-3xl"></div>)
            ) : holidays.length > 0 ? (
              holidays.map((holiday, idx) => (
                <div key={holiday.id} className={clsx(
                  "p-6 rounded-3xl border transition-all duration-500 group relative overflow-hidden",
                  holiday.type === 'Holiday' 
                    ? 'bg-red-50/50 border-red-100 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/5' 
                    : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-500/5'
                )}>
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform",
                    holiday.type === 'Holiday' ? 'bg-red-500 text-white' : 'bg-blue-primary text-white'
                  )}>
                    {new Date(holiday.date).getUTCDate()}
                  </div>
                  <h4 className="font-display font-bold text-xl text-blue-dark leading-snug mb-2 group-hover:text-blue-primary transition-colors">{holiday.title}</h4>
                  <p className={clsx(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    holiday.type === 'Holiday' ? 'text-red-500' : 'text-blue-primary'
                  )}>{holiday.type}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center glass rounded-[2.5rem] bg-off-white border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <CalendarDays className="text-gray-300" size={32} />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm mb-4">Focus on Learning</p>
                <p className="text-gray-mid text-sm mb-8">No holidays remaining for the rest of this month.</p>
                <Link to="/holidays" className="btn-secondary !py-3 !px-8 text-sm">Full Annual Calendar</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="section-padding bg-off-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <SectionHeader 
              className="!mb-0"
              label="Life at ST. Anne's" 
              heading={<><ImageIcon className="inline-block mr-4 text-blue-primary" size={40} />Visual Journey</>} 
              subtext="Captured moments of learning, laughter, and achievement."
            />
            <Link to="/gallery" className="btn-primary">
              Explore Media Gallery
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
            {loading ? (
               Array(8).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-2xl"></div>)
            ) : gallery.length > 0 ? (
              gallery.slice(0, 8).map((photo, idx) => (
                <div key={photo.id} className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                  <img 
                    src={`/${photo.image_url}`} 
                    alt={photo.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-deeper/90 via-blue-deeper/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                     <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-yellow font-black uppercase tracking-[0.2em] mb-2 block">School Life</span>
                        <p className="text-white font-display font-bold text-lg leading-tight truncate">{photo.title}</p>
                     </div>
                  </div>
                </div>
              ))
            ) : (
               <div className="col-span-full py-20 text-center glass rounded-3xl border border-gray-100">
                 <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
                 <p className="text-gray-300 font-bold uppercase tracking-[0.2em] text-sm">Our lens is resting...</p>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Modern Contact Strip */}
      <section className="bg-blue-primary py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="glass p-12 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left max-w-2xl">
              <h2 className="font-display font-black text-white text-4xl md:text-5xl mb-6 tracking-tight leading-tight">Begin your child's journey with ST. Anne's.</h2>
              <p className="text-white/70 text-lg mb-10">Our admissions office is ready to help you with any questions about the curriculum, facilities, or enrollment process.</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-white font-mono text-[11px] uppercase tracking-[0.2em]">
                <div className="flex items-center gap-3"><CalendarDays size={18} className="text-yellow" /> Mon–Sat, 8am–2pm</div>
                <div className="flex items-center gap-3"><Phone size={18} className="text-yellow" /> 06654221118</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link to="/contact" className="btn-primary !bg-yellow !text-blue-deeper hover:!bg-white shadow-2xl px-12 py-5 text-lg font-black tracking-tight whitespace-nowrap text-center">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
