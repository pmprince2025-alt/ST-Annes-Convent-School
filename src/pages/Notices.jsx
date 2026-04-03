import React, { useState, useEffect } from 'react';
import Badge from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { FileText, Download, BellRing } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const { ref: boardRef, inView: boardInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const categories = ['All', 'Academic', 'Exam', 'Holiday', 'General'];

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setNotices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
    const sub = supabase.channel('page_notices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => fetchNotices())
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const filteredNotices = filter === 'All' ? notices : notices.filter(n => n.category === filter);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `/${url}`;
  };

  return (
    <div className="w-full bg-off-white min-h-screen">
      {/* Page Hero */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="Notice Board" className="w-full h-full object-cover scale-110 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/40 to-blue-deeper/90 opacity-90"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-yellow/20 backdrop-blur-md border border-yellow/30 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="font-mono font-bold text-yellow text-[10px] uppercase tracking-[0.3em]">Latest Communications</span>
          </div>
          <h1 className="font-display font-black text-white text-[56px] md:text-[72px] lg:text-[84px] animate-fade-up tracking-tighter leading-none mb-6">
            Notice <span className="text-yellow">Board</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium animate-fade-up max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '200ms' }}>
            Stay updated with the latest announcements, circulars, and official reports from ST. Anne's Convent School.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </section>

      <section className="section-padding max-w-7xl mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center animate-fade-up">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={clsx(
                "px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                filter === cat 
                  ? "bg-blue-primary text-white shadow-xl shadow-blue-primary/20 scale-105" 
                  : "glass text-gray-text hover:bg-white hover:text-blue-primary border-white/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices Board Container */}
        <div 
          ref={boardRef}
          className={clsx(
            "glass rounded-[3rem] border border-white scroll-mt-24 shadow-2xl relative overflow-hidden animate-on-scroll",
            boardInView && "in-view"
          )}
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-primary via-yellow to-blue-primary"></div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="font-display font-black text-3xl text-blue-deeper tracking-tighter uppercase italic">Board Archive</h2>
                <div className="w-12 h-1 bg-yellow mt-2 rounded-full"></div>
              </div>
              <div className="flex items-center gap-3 text-gray-mid">
                <BellRing size={20} className="text-yellow" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Live Updates Channel</span>
              </div>
            </div>

            {loading ? (
               <div className="py-24 text-center">
                 <div className="w-12 h-12 rounded-full border-[4px] border-yellow border-t-transparent animate-spin mx-auto mb-6"></div>
                 <span className="font-mono text-xs font-black text-blue-dark/50 uppercase tracking-[0.4em]">Synchronizing...</span>
               </div>
            ) : filteredNotices.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-300 border border-dashed border-gray-200">
                  <FileText size={40} strokeWidth={1} />
                </div>
                <h3 className="font-display text-2xl font-black text-blue-deeper/30 uppercase tracking-tighter mb-2">Notice Archive Empty</h3>
                <p className="text-gray-mid font-medium">Currently no communications published in this category.</p>
              </div>
            ) : (
               <div className="flex flex-col divide-y divide-gray-100/50">
                 {/* Desktop Headings */}
                 <div className="hidden md:flex py-5 px-10 text-[10px] font-black text-blue-dark/30 uppercase tracking-[0.3em] border-b border-gray-100/50">
                   <div className="w-40 shrink-0">Status & Date</div>
                   <div className="w-32 shrink-0">Category</div>
                   <div className="flex-1">Announcement Details</div>
                   <div className="w-32 shrink-0 text-right">Action</div>
                 </div>

                 {/* Rows */}
                 {filteredNotices.map((notice) => (
                   <div key={notice.id} className="group relative flex flex-col md:flex-row items-start md:items-center py-8 md:py-10 px-6 md:px-10 hover:bg-blue-light/20 transition-all duration-500 rounded-2xl md:rounded-none">
                     
                     {/* Date/Status */}
                     <div className="w-full md:w-40 shrink-0 mb-4 md:mb-0">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse"></div>
                         <span className="text-[10px] font-black text-yellow uppercase tracking-widest">Active</span>
                       </div>
                       <div className="font-mono text-xs font-black text-blue-primary">
                         {new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                       </div>
                     </div>
                     
                     {/* Category */}
                     <div className="w-full md:w-32 shrink-0 mb-6 md:mb-0">
                       <Badge category={notice.category} className="!text-[9px] !font-black !px-4 !py-1.5 shadow-sm uppercase tracking-widest border border-white/50" />
                     </div>
                     
                     {/* Title & Content */}
                     <div className="flex-1 md:pr-10 mb-8 md:mb-0">
                       <h3 className="font-display font-black text-xl text-blue-deeper mb-3 group-hover:text-blue-primary transition-colors leading-tight">{notice.title}</h3>
                       {notice.description && (
                         <div 
                           className="text-sm text-gray-text leading-relaxed font-medium mt-3 opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2 prose prose-sm max-w-none prose-p:my-0 prose-strong:text-blue-dark"
                           dangerouslySetInnerHTML={{ __html: notice.description }} 
                         />
                       )}
                     </div>
                     
                     {/* Action */}
                     <div className="w-full md:w-32 shrink-0 flex justify-start md:justify-end">
                       {notice.pdf_url ? (
                         <a href={notice.pdf_url} target="_blank" rel="noopener noreferrer" className="group/btn inline-flex items-center gap-3 text-[10px] font-black text-blue-deeper uppercase tracking-widest bg-white border border-gray-100 hover:bg-blue-deeper hover:text-white hover:border-blue-deeper px-6 py-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-deeper/10">
                           <span>View Document</span> 
                           <Download size={14} className="shrink-0 -translate-y-0.5 group-hover/btn:translate-y-0.5 transition-transform" />
                         </a>
                       ) : (
                         <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest hidden md:inline-block">No Attachment</span>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notices;
