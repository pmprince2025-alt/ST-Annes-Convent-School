import React, { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { useSupabaseQuery } from '../hooks/useSupabase';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Award, CheckCircle, BookOpen, ArrowRight, Star } from 'lucide-react';
import * as PhosphorIcons from 'lucide-react'; // Dynamic icon loading fallback

const Academics = () => {
  const [activeTab, setActiveTab] = useState('Pre-Primary');
  const tabs = ['Pre-Primary', 'Primary', 'Upper Primary', 'Secondary'];

  const { ref: boardRef, inView: boardInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const { data: academicsData, loading: academicsLoading } = useSupabaseQuery('academics');
  const { data: activitiesData, loading: actLoading } = useSupabaseQuery('activities');
  const { data: achievementsData, loading: achLoading } = useSupabaseQuery('achievements', { orderBy: 'year', ascending: false });

  const currentLevelData = academicsData?.find(d => d.level === activeTab);

  return (
    <div className="w-full bg-off-white min-h-screen">
      {/* Page Hero */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/classroom2.jpg" alt="Academics" className="w-full h-full object-cover scale-110 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/50 to-blue-deeper/90 opacity-90"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="font-mono font-bold text-yellow text-[10px] uppercase tracking-[0.3em]">Knowledge is Power</span>
          </div>
          <h1 className="font-display font-black text-white text-[56px] md:text-[72px] lg:text-[84px] animate-fade-up tracking-tighter leading-none mb-6">
            Academic <span className="text-yellow">Excellence</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium animate-fade-up max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '200ms' }}>
            A comprehensive curriculum designed to inspire curiosity, critical thinking, and a lifelong passion for learning.
          </p>
        </div>

        {/* Abstract elements */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-yellow/10 rounded-full blur-3xl"></div>
      </section>

      {/* Classes Offered / Curriculum Tabs */}
      <section className="section-padding relative">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="System of Education" heading="Levels of Learning" className="text-center mx-auto mb-16" center />
          
          <div 
            ref={boardRef}
            className={clsx(
              "bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-on-scroll",
              boardInView && "in-view"
            )}
          >
            {/* Tab Headers */}
            <div className="flex overflow-x-auto bg-off-white/50 border-b border-gray-100 scrollbar-hide p-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "flex-1 min-w-[140px] py-4 px-6 text-sm font-black uppercase tracking-widest transition-all duration-300 rounded-2xl",
                    activeTab === tab 
                      ? "bg-blue-primary text-white shadow-xl shadow-blue-primary/20" 
                      : "text-gray-400 hover:text-blue-primary hover:bg-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="p-8 md:p-16 relative">
              {academicsLoading ? (
                 <div className="animate-pulse space-y-6">
                   <div className="h-10 w-1/4 bg-gray-100 rounded-xl"></div>
                   <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                   <div className="h-4 w-5/6 bg-gray-100 rounded-lg"></div>
                   <div className="h-40 w-full bg-gray-50 rounded-2xl mt-12"></div>
                 </div>
              ) : currentLevelData ? (
                <div className="animate-fade-up">
                  <div className="flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-2/3">
                      <h3 className="text-4xl md:text-5xl font-display font-black text-blue-dark mb-6 leading-tight">
                        {currentLevelData.level} <span className="text-blue-primary">Stage</span>
                      </h3>
                      <p className="text-gray-text text-xl leading-relaxed mb-10 font-medium">
                        {currentLevelData.description}
                      </p>
                      
                      <div className="relative p-8 rounded-3xl bg-blue-primary/5 border border-blue-primary/10 overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-primary/5 rounded-full blur-2xl"></div>
                         <h4 className="font-display font-bold text-blue-dark mb-6 flex items-center gap-3">
                           <BookOpen size={24} className="text-blue-primary" />
                           Core Subjects & Focus Area
                         </h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {currentLevelData.subjects.map((sub, i) => (
                             <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-50 group hover:border-yellow transition-colors">
                               <div className="w-8 h-8 rounded-lg bg-yellow/10 flex items-center justify-center text-amber-700 shrink-0">
                                 <CheckCircle size={16} />
                               </div>
                               <span className="font-bold text-blue-dark text-sm">{sub}</span>
                             </div>
                           ))}
                         </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-1/3 flex flex-col gap-6">
                       <div className="glass p-8 rounded-3xl border border-blue-primary/10 shadow-lg">
                          <h5 className="font-bold text-blue-primary text-xs uppercase tracking-[0.2em] mb-4">Teaching Methodology</h5>
                          <p className="text-sm text-gray-text leading-relaxed font-medium">Interactive sessions, project-based learning, and regular assessment to ensure complete understanding of concepts.</p>
                       </div>
                       <div className="bg-yellow p-8 rounded-3xl shadow-xl shadow-yellow/10">
                          <h5 className="font-bold text-blue-deeper text-xs uppercase tracking-[0.2em] mb-4">Admissions</h5>
                          <p className="text-sm font-bold text-blue-deeper/80 mb-6">Currently accepting applications for the academic year 2026-27.</p>
                          <Link to="/contact" className="w-full inline-flex items-center justify-center gap-2 bg-blue-deeper text-white py-3 rounded-xl font-bold hover:bg-blue-dark transition-colors">
                            Apply Now <ArrowRight size={16} />
                          </Link>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-mid py-20 text-center glass rounded-3xl border border-dashed border-gray-200">
                   <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
                   <p className="font-bold uppercase tracking-widest text-sm text-gray-400">Curriculum details coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Co-Curricular */}
      <section className="section-padding bg-blue-deeper relative overflow-hidden">
        {/* Glow elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader 
             dark 
             label="Beyond Academics" 
             heading="Co-Curricular Realm" 
             subtext="Nurturing talents in sports, arts, and innovation."
             className="text-center mx-auto mb-20"
             center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actLoading ? (
               Array(3).fill(0).map((_, i) => <div key={i} className="h-64 glass animate-pulse rounded-3xl"></div>)
            ) : activitiesData?.length > 0 ? (
               activitiesData.map((act, i) => {
                 const pascalIcon = act.icon.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                 const Icon = PhosphorIcons[pascalIcon] || PhosphorIcons.Star;
                 return (
                   <div key={act.id} className="group relative glass p-10 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                     <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 text-yellow border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-yellow group-hover:text-blue-deeper transition-all duration-500">
                       <Icon size={36} strokeWidth={1.5} />
                     </div>
                     <h3 className="font-display font-black text-2xl mb-4 text-white group-hover:text-yellow transition-colors">{act.name}</h3>
                     <p className="text-gray-400 leading-relaxed text-[17px] font-medium">{act.description}</p>
                   </div>
                 )
               })
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-3xl border border-white/5">
                <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-sm">Activities catalog updating...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader label="Hall of Fame" heading={<><Award size={40} className="inline-block mr-4 text-blue-primary" />Our Achievements</>} className="text-center mx-auto mb-20" center />
          
          <div className="space-y-6">
            {achLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-off-white animate-pulse rounded-2xl"></div>)
            ) : achievementsData?.length > 0 ? (
              achievementsData.map((ach) => (
                <div key={ach.id} className="group relative glass p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 shrink-0 bg-blue-primary/5 rounded-2xl flex items-center justify-center text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-all duration-500">
                      <Award size={32} />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-2xl text-blue-dark mb-1 group-hover:text-blue-primary transition-colors">{ach.title}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                         <span className="font-bold text-blue-primary text-sm tracking-tight">{ach.recipient}</span>
                         <div className="w-1 h-1 bg-gray-200 rounded-full hidden sm:block"></div>
                         <span className="font-mono bg-blue-deeper text-white/90 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">{ach.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <div className="h-px w-12 bg-gray-100 hidden lg:block"></div>
                    <div className="font-display font-black text-5xl text-blue-dark/5 group-hover:text-blue-primary/10 transition-colors select-none">
                      {ach.year}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 glass rounded-3xl border border-dashed border-gray-200">
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Awaiting new milestones</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
