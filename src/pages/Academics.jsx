import React, { useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { useSupabaseQuery } from '../hooks/useSupabase';
import clsx from 'clsx';
import { Award, CheckCircle } from 'lucide-react';
import * as PhosphorIcons from 'lucide-react'; // Dynamic icon loading fallback

const Academics = () => {
  const [activeTab, setActiveTab] = useState('Pre-Primary');
  const tabs = ['Pre-Primary', 'Primary', 'Upper Primary', 'Secondary'];

  const { data: academicsData, loading: academicsLoading } = useSupabaseQuery('academics');
  const { data: activitiesData, loading: actLoading } = useSupabaseQuery('activities');
  const { data: achievementsData, loading: achLoading } = useSupabaseQuery('achievements', { orderBy: 'year', ascending: false });

  const currentLevelData = academicsData?.find(d => d.level === activeTab);

  return (
    <div className="w-full bg-off-white">
      {/* Page Hero */}
      <section className="relative w-full h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/classroom2.jpg" alt="Academics" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/70"></div>
        </div>
        <h1 className="relative z-10 font-display font-bold text-white text-[48px] animate-fade-up">Academics</h1>
      </section>

      {/* Classes Offered / Curriculum Tabs */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader label="Curriculum" heading="Classes Offered" className="text-center mx-auto" />
          
          <div className="mt-12 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-200">
            {/* Tab Headers */}
            <div className="flex flex-wrap border-b border-gray-200 bg-gray-50/50">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "flex-1 min-w-[140px] py-4 px-6 text-[15px] font-semibold transition-all select-none outline-none",
                    activeTab === tab 
                      ? "bg-white text-blue-primary border-b-2 border-yellow shadow-[0_-4px_0_0_#F5C200_inset]" 
                      : "text-gray-text hover:text-blue-dark hover:bg-gray-100"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="p-8 md:p-12 min-h-[300px]">
              {academicsLoading ? (
                 <div className="animate-pulse space-y-4">
                   <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                   <div className="h-4 w-full bg-gray-200 rounded mt-6"></div>
                   <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                 </div>
              ) : currentLevelData ? (
                <div className="animate-fade-up" style={{ animationDuration: '0.4s' }}>
                  <h3 className="text-2xl font-display font-bold text-blue-dark mb-4">{currentLevelData.level} Education</h3>
                  <p className="text-gray-text text-lg leading-relaxed mb-10 max-w-3xl">
                    {currentLevelData.description}
                  </p>
                  
                  <h4 className="font-semibold text-blue-deeper mb-6 uppercase tracking-wider text-sm border-b border-gray-200 pb-2">Core Subjects</h4>
                  <div className="flex flex-wrap gap-3">
                    {currentLevelData.subjects.map((sub, i) => (
                      <span key={i} className="inline-flex items-center gap-2 bg-blue-50 text-blue-dark border border-blue-100 px-4 py-2 rounded-lg text-sm font-medium">
                        <CheckCircle size={16} className="text-yellow" /> {sub}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-mid py-12 text-center">No data available for this level.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Co-Curricular */}
      <section className="py-24 bg-blue-deeper text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-mono text-yellow text-sm uppercase tracking-widest mb-3">✦ Beyond the Classroom ✦</p>
            <h2 className="font-display text-4xl font-bold">Co-Curricular Activities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {actLoading ? (
               <div className="col-span-full py-12 text-center text-gray-400">Loading activities...</div>
            ) : activitiesData?.length > 0 ? (
               activitiesData.map((act, i) => {
                 // Convert 'book-open' to 'BookOpen', 'medal' to 'Medal'
                 const pascalIcon = act.icon.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                 const Icon = PhosphorIcons[pascalIcon] || PhosphorIcons.Star; // Fallback to Star if icon missing
                 return (
                   <div key={act.id} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors backdrop-blur-sm">
                     <div className="w-14 h-14 bg-blue-primary/30 rounded-full flex items-center justify-center mb-6 text-yellow">
                       <Icon size={28} />
                     </div>
                     <h3 className="font-display font-bold text-xl mb-3 text-white">{act.name}</h3>
                     <p className="text-gray-300 leading-relaxed text-[15px]">{act.description}</p>
                   </div>
                 )
               })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400">No activities recorded.</div>
            )}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader label="Hall of Fame" heading="Our Proud Achievements" className="text-center mx-auto" />
          
          <div className="mt-16 bg-off-white rounded-2xl border border-gray-light p-6 md:p-10">
            {achLoading ? (
              <div className="text-center text-gray-mid py-12">Loading achievements...</div>
            ) : achievementsData?.length > 0 ? (
              <div className="space-y-4">
                {achievementsData.map((ach) => (
                  <div key={ach.id} className="group relative bg-white p-5 md:p-6 rounded-xl border border-gray-light shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 shrink-0 bg-yellow/10 rounded-full flex items-center justify-center text-yellow">
                        <Award size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-dark text-lg md:text-xl">{ach.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-text">
                           <span className="font-semibold text-blue-primary">{ach.recipient}</span>
                           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                           <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{ach.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-3xl font-bold text-gray-200 mt-2 md:mt-0 shrink-0 select-none">
                      {ach.year}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-mid py-12">No achievements recorded yet.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
