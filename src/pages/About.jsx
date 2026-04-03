import React from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { useSupabaseQuery } from '../hooks/useSupabase';
import { useInView } from 'react-intersection-observer';
import { Star, ShieldCheck, Heart, Users, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const About = () => {
  const { data: staff, loading: staffLoading } = useSupabaseQuery('staff', { eq: { column: 'role', value: 'principal' }, limit: 1 });
  const { data: history, loading: historyLoading } = useSupabaseQuery('history', { orderBy: 'year', ascending: true });

  const { ref: visionRef, inView: visionInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const principal = staff?.length > 0 ? staff[0] : {
    name: 'Sr. Cynthia',
    designation: 'Principal',
    photo_url: 'logo.png',
    message: "Welcome to ST. Anne's Convent School. We strive to provide a nurturing environment where every child can explore their potential, experiment with new ideas, and excel in all their endeavors."
  };

  const values = [
    { title: 'Excellence', icon: Star, desc: 'Striving for the highest standards in all pursuits.' },
    { title: 'Faith', icon: Heart, desc: 'Nurturing spiritual growth and moral character.' },
    { title: 'Knowledge', icon: BookOpen, desc: 'Fostering a lifelong love for learning and discovery.' },
    { title: 'Service', icon: Users, desc: 'Encouraging compassion and contribution to society.' },
    { title: 'Creativity', icon: Lightbulb, desc: 'Inspiring innovative thinking and expression.' },
    { title: 'Integrity', icon: ShieldCheck, desc: 'Upholding honesty and strong moral principles.' },
  ];

  return (
    <div className="w-full">
      {/* Page Hero */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="About Our School" className="w-full h-full object-cover scale-110 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/40 to-blue-deeper/90 opacity-90"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-yellow/20 backdrop-blur-md border border-yellow/30 px-4 py-1 rounded-full mb-6 animate-fade-up">
            <span className="font-mono font-bold text-yellow text-[10px] uppercase tracking-[0.3em]">Established 1994</span>
          </div>
          <h1 className="font-display font-black text-white text-[48px] md:text-[64px] lg:text-[72px] animate-fade-up tracking-tighter leading-none mb-4">
            Our <span className="text-yellow">Legacy</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium animate-fade-up" style={{ animationDelay: '200ms' }}>Building foundations for a brighter future.</p>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-off-white relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div 
            ref={visionRef}
            className={clsx(
              "glass p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/20 animate-on-scroll group hover:bg-white transition-all duration-500",
              visionInView && "in-view"
            )}
          >
            <div className="w-16 h-16 bg-blue-primary/10 rounded-2xl flex items-center justify-center text-blue-primary mb-8 group-hover:scale-110 transition-transform">
               <Lightbulb size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-display font-black text-4xl text-blue-dark mb-6">Our Vision</h2>
            <p className="text-gray-text text-xl leading-relaxed font-medium">
              "ST. Anne's Convent School is a nurturing ground for the holistic growth and development of young children to make an effective contribution to the nation for societal change and dynamic transformation."
            </p>
          </div>
          
          <div 
            ref={missionRef}
            className={clsx(
              "glass p-10 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/20 animate-on-scroll group hover:bg-white transition-all duration-500",
              missionInView && "in-view"
            )} 
            style={{ transitionDelay: '100ms' }}
          >
            <div className="w-16 h-16 bg-blue-primary/10 rounded-2xl flex items-center justify-center text-blue-primary mb-8 group-hover:scale-110 transition-transform">
               <CheckCircle size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-display font-black text-4xl text-blue-dark mb-8">Our Mission</h2>
            <ul className="space-y-5 text-gray-text">
              {[
                "To foster a love for learning and discovery in every child.",
                "To encourage critical thinking and scientific temper.",
                "To instill strong moral values, discipline, and responsibility.",
                "To provide a safe, inclusive, and empowering environment."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group/item">
                  <div className="w-6 h-6 rounded-full bg-yellow/20 flex items-center justify-center shrink-0 mt-1 group-hover/item:bg-yellow transition-colors">
                     <div className="w-2 h-2 rounded-full bg-amber-700"></div>
                  </div>
                  <span className="text-lg font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <SectionHeader label="Leadership" heading="Principal's Message" className="text-center mx-auto mb-20" center />
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center mb-10">
            <div className="relative group">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-700">
                {staffLoading ? (
                  <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                ) : (
                  <img src={`/${principal.photo_url || 'logo.png'}`} alt={principal.name} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                )}
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow/10 rounded-full blur-3xl -z-10"></div>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="relative mb-12">
                <span className="absolute -top-10 -left-6 text-[120px] text-blue-primary/10 font-display leading-none selection:bg-transparent pointer-events-none">"</span>
                <p className="text-2xl md:text-3xl text-blue-dark leading-[1.6] font-display italic font-medium relative z-10">
                  {staffLoading ? 'Loading message...' : principal.message}
                </p>
                <span className="absolute -bottom-20 -right-4 text-[120px] text-blue-primary/10 font-display leading-none selection:bg-transparent rotate-180 pointer-events-none">"</span>
              </div>
              
              <div className="pt-8 border-t border-gray-100">
                <h3 className="font-display font-black text-3xl text-blue-deeper mb-1">{staffLoading ? '...' : principal.name}</h3>
                <p className="text-blue-primary font-mono font-bold tracking-[0.2em] uppercase text-xs">{staffLoading ? '...' : principal.designation}</p>
                <div className="mt-6 flex items-center justify-center lg:justify-start gap-4">
                   <div className="w-10 h-px bg-yellow"></div>
                   <span className="font-medium text-gray-400 italic">Signature of Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-padding bg-off-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <SectionHeader label="Growth" heading="Our Journey" className="text-center mx-auto mb-20" center />
          
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-primary/30 to-transparent md:-translate-x-1/2"></div>
            
            <div className="space-y-20 relative">
              {historyLoading ? (
                 <div className="text-center text-gray-mid">Recalling our past...</div>
              ) : history?.length > 0 ? (
                history.map((item, idx) => (
                  <div key={item.id} className={clsx(
                    "relative flex flex-col md:flex-row items-center",
                    idx % 2 === 0 ? "md:flex-row-reverse" : ""
                  )}>
                    {/* Dot */}
                    <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-yellow border-4 border-white shadow-xl z-20 md:-translate-x-1/2 shadow-yellow/20 group-hover:scale-150 transition-transform"></div>
                    
                    {/* Content */}
                    <div className={clsx(
                      "w-full md:w-[calc(50%-48px)] pl-16 md:pl-0",
                      idx % 2 === 0 ? "md:pr-0" : ""
                    )}>
                      <div className="glass p-8 rounded-[2rem] border border-white/50 shadow-xl group hover:shadow-2xl transition-all duration-500 hover:bg-white">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="font-display font-black text-3xl text-blue-primary">{item.year}</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-blue-primary/20 to-transparent"></div>
                        </div>
                        <p className="text-gray-text text-lg leading-relaxed font-medium">{item.milestone}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-mid py-12 glass rounded-3xl border border-dashed border-gray-200">History markers arriving soon.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionHeader label="Foundation" heading="Core Values" className="mx-auto mb-20" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="group relative glass p-10 rounded-[3rem] border border-white/50 shadow-xl hover:shadow-2xl hover:shadow-blue-primary/5 transition-all duration-500 overflow-hidden text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="w-20 h-20 mx-auto bg-blue-primary/5 rounded-[2rem] flex items-center justify-center mb-8 text-blue-primary group-hover:scale-110 group-hover:bg-blue-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <v.icon size={36} strokeWidth={1.5} />
                </div>
                
                <h3 className="font-display font-black text-2xl text-blue-dark mb-4 group-hover:text-blue-primary transition-colors">{v.title}</h3>
                <p className="text-gray-text text-lg leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
