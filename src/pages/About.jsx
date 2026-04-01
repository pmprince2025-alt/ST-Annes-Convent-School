import React from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import { useSupabaseQuery } from '../hooks/useSupabase';
import { Star, ShieldCheck, Heart, Users, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';

const About = () => {
  const { data: staff, loading: staffLoading } = useSupabaseQuery('staff', { eq: { column: 'role', value: 'principal' }, limit: 1 });
  const { data: history, loading: historyLoading } = useSupabaseQuery('history', { orderBy: 'year', ascending: true });

  const principal = staff?.length > 0 ? staff[0] : {
    name: 'Sr. Cynthia',
    designation: 'Principal',
    photo_url: 'logo.png',
    message: "Welcome to ST Anne's Convent School. We strive to provide a nurturing environment where every child can explore their potential, experiment with new ideas, and excel in all their endeavors."
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
      <section className="relative w-full h-[260px] sm:h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="About Our School" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/70"></div>
        </div>
        <h1 className="relative z-10 font-display font-bold text-white text-[36px] sm:text-[48px] animate-fade-up px-6 text-center">About Our School</h1>
      </section>

      {/* Vision & Mission */}
      <section className="pt-10 sm:pt-16 pb-8 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white p-6 sm:p-10 rounded-xl sm:rounded-[10px] shadow-sm border-t-4 border-yellow animate-fade-up">
            <h2 className="font-display font-bold text-3xl text-blue-dark mb-6">Our Vision</h2>
            <p className="text-gray-text text-lg leading-relaxed">
              "ST Anne's Convent School is a nurturing ground for the holistic growth and development of young children to make an effective contribution to the nation for societal change and dynamic transformation."
            </p>
          </div>
          <div className="bg-white p-6 sm:p-10 rounded-xl sm:rounded-[10px] shadow-sm border-t-4 border-blue-primary animate-fade-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-blue-dark mb-4 sm:mb-6">Our Mission</h2>
            <ul className="space-y-4 text-gray-text">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-yellow shrink-0 mt-0.5" size={20} />
                <span>To foster a love for learning and discovery in every child.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-yellow shrink-0 mt-0.5" size={20} />
                <span>To encourage critical thinking and scientific temper through experimentation.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-yellow shrink-0 mt-0.5" size={20} />
                <span>To instill strong moral values, discipline, and social responsibility.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-yellow shrink-0 mt-0.5" size={20} />
                <span>To provide a safe, inclusive, and empowering environment.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="pt-8 pb-12 sm:pb-24 bg-white border-y border-gray-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Leadership" heading="Principal's Message" className="text-center mx-auto" flexCenter />
          
          <div className="flex flex-col md:flex-row gap-8 sm:gap-12 mt-10 sm:mt-16 items-center">
            <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full bg-blue-100 overflow-hidden shadow-xl border-4 border-white object-cover">
              {staffLoading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              ) : (
                <img src={`/${principal.photo_url || 'logo.png'}`} alt={principal.name} className="w-full h-full object-cover" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <span className="text-6xl text-yellow opacity-40 font-display leading-none block mb-[-20px]">"</span>
              <p className="text-xl md:text-2xl text-blue-dark leading-relaxed font-body italic mb-8 relative z-10 px-4 md:px-0">
                {staffLoading ? 'Loading message...' : principal.message}
              </p>
              <div>
                <h3 className="font-display font-bold text-2xl text-blue-deeper">{staffLoading ? '...' : principal.name}</h3>
                <p className="text-blue-primary font-medium tracking-wider uppercase text-sm mt-1">{staffLoading ? '...' : principal.designation}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-padding bg-off-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHeader label="Our Journey" heading="School History" />
          
          <div className="mt-16 space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-blue-200">
            {historyLoading ? (
               <div className="text-center text-gray-mid">Loading history...</div>
            ) : history?.length > 0 ? (
              history.map((item, idx) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-yellow text-blue-deeper font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <div className="w-2.5 h-2.5 bg-blue-deeper rounded-full"></div>
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 justify-between rounded-xl shadow-sm border border-gray-light">
                    <span className="font-mono text-xl text-blue-primary font-bold block mb-2">{item.year}</span>
                    <p className="text-gray-text">{item.milestone}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-mid relative z-10">No history milestones recorded yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white border-t border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionHeader label="Foundation" heading="Our Core Values" className="mx-auto" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mt-10 sm:mt-16">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-xl border border-gray-light shadow-sm hover:shadow-lg transition-shadow border-t-[3px] border-t-blue-primary text-center">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-primary">
                  <v.icon size={32} />
                </div>
                <h3 className="font-display font-bold text-xl text-blue-dark mb-3">{v.title}</h3>
                <p className="text-gray-text">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
