import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import Badge from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { FileText, Download, BellRing } from 'lucide-react';
import clsx from 'clsx';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

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
      <section className="relative w-full h-[260px] sm:h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="Notice Board" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/80 backdrop-blur-[2px]"></div>
        </div>
        <h1 className="relative z-10 font-display font-bold text-white text-[36px] sm:text-[48px] animate-fade-up flex items-center gap-3 sm:gap-4 px-6 text-center">
          <BellRing size={32} className="text-yellow sm:w-10 sm:h-10" /> Notice Board
        </h1>
      </section>

      <section className="section-padding max-w-6xl mx-auto px-4 sm:px-6">
        {/* Filter Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6 sm:mb-8 bg-white rounded-t-xl shadow-sm scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={clsx(
                "flex-1 min-w-[90px] sm:min-w-[120px] py-3 sm:py-4 px-4 sm:px-6 text-[13px] sm:text-[15px] font-semibold transition-all outline-none whitespace-nowrap",
                filter === cat 
                  ? "bg-blue-50 text-blue-primary border-b-[3px] border-blue-primary" 
                  : "text-gray-text hover:text-blue-dark hover:bg-gray-50 border-b-[3px] border-transparent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices List Layout */}
        <div className="bg-white border text-left border-gray-light rounded-b-2xl rounded-t-none shadow-md overflow-hidden animate-fade-up bg-white">
          {loading ? (
             <div className="py-20 text-center text-gray-mid">
               <div className="w-8 h-8 rounded-full border-4 border-yellow border-t-transparent animate-spin mx-auto mb-4"></div>
               Loading notices...
             </div>
          ) : filteredNotices.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <FileText size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-blue-deeper mb-2">No notices found</h3>
              <p className="text-gray-mid">There are currently no published notices for this category.</p>
            </div>
          ) : (
             <div className="flex flex-col divide-y divide-gray-100">
               {/* Headings */}
               <div className="hidden md:flex py-4 px-8 bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                 <div className="w-32 shrink-0">Date</div>
                 <div className="w-32 shrink-0">Category</div>
                 <div className="flex-1">Title & Details</div>
                 <div className="w-32 shrink-0 text-right">Attachment</div>
               </div>

               {/* Rows */}
               {filteredNotices.map((notice) => (
                 <div key={notice.id} className="group relative flex flex-col md:flex-row items-start md:items-center py-4 sm:py-6 px-4 sm:px-6 md:px-8 hover:bg-blue-light/50 transition-colors">
                   
                   {/* Date */}
                   <div className="w-full md:w-32 shrink-0 font-mono text-[13.5px] font-bold text-blue-primary mb-3 md:mb-0">
                     {new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                   </div>
                   
                   {/* Badge */}
                   <div className="w-full md:w-32 shrink-0 mb-3 md:mb-0">
                     <Badge category={notice.category} className="!text-[11px] shadow-sm" />
                   </div>
                   
                   {/* Title / Desc */}
                   <div className="flex-1 pr-6 mb-4 md:mb-0">
                     <h3 className="font-bold text-blue-dark text-[17px] mb-1 leading-tight group-hover:text-blue-primary transition-colors">{notice.title}</h3>
                     {notice.description && (
                       <div 
                         className="text-sm text-gray-text leading-relaxed line-clamp-2 mt-2 prose prose-sm max-w-none"
                         dangerouslySetInnerHTML={{ __html: notice.description }} 
                       />
                     )}
                   </div>
                   
                   {/* Action */}
                   <div className="w-full md:w-32 shrink-0 flex justify-start md:justify-end">
                     {notice.pdf_url ? (
                       <a href={notice.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-yellow hover:text-yellow-dark bg-yellow/10 hover:bg-yellow/20 px-4 py-2 rounded-lg transition-colors">
                         <span className="md:hidden">Download</span> <Download size={18} className="shrink-0" />
                       </a>
                     ) : (
                       <span className="text-sm font-medium text-gray-300 hidden md:inline-block">—</span>
                     )}
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

export default Notices;
