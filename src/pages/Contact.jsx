import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import SectionHeader from '../components/ui/SectionHeader';
import clsx from 'clsx';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ref: formRef, inView: formInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: mapRef, inView: mapInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('messages').insert([
        { 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone || null, 
          message: formData.message 
        }
      ]);

      if (error) throw error;
      
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-off-white min-h-screen">
      {/* Page Hero */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="Contact Us" className="w-full h-full object-cover scale-110 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-deeper/90 via-blue-deeper/40 to-blue-deeper/90 opacity-90"></div>
          <div className="absolute inset-0 bg-blue-primary/10 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="inline-block bg-yellow/20 backdrop-blur-md border border-yellow/30 px-4 py-1.5 rounded-full mb-8 animate-fade-up">
            <span className="font-mono font-bold text-yellow text-[10px] uppercase tracking-[0.3em]">We're here to help</span>
          </div>
          <h1 className="font-display font-black text-white text-[56px] md:text-[72px] lg:text-[84px] animate-fade-up tracking-tighter leading-none mb-6">
            Get <span className="text-yellow">In Touch</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-medium animate-fade-up max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '200ms' }}>
            Reach out to us for any queries regarding admissions, academics, or school activities.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </section>

      <section className="section-padding max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Form */}
          <div 
            ref={formRef}
            className={clsx(
              "glass p-10 md:p-14 rounded-[3rem] border border-white scroll-mt-24 shadow-2xl relative overflow-hidden animate-on-scroll",
              formInView && "in-view"
            )}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-primary via-yellow to-blue-primary"></div>
            
            <SectionHeader 
              label="Communication" 
              heading="Send a Message" 
              subtext="Fill out the form and our representative will get back to you shortly."
              className="!mb-12"
            />

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[10px] font-black text-blue-dark uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-off-white border border-gray-100 focus:bg-white focus:border-blue-primary focus:ring-4 focus:ring-blue-primary/5 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-[10px] font-black text-blue-dark uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-off-white border border-gray-100 focus:bg-white focus:border-blue-primary focus:ring-4 focus:ring-blue-primary/5 outline-none transition-all placeholder:text-gray-300 font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-black text-blue-dark uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-off-white border border-gray-100 focus:bg-white focus:border-blue-primary focus:ring-4 focus:ring-blue-primary/5 outline-none transition-all placeholder:text-gray-300 font-medium"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-[10px] font-black text-blue-dark uppercase tracking-widest ml-1">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-2xl bg-off-white border border-gray-100 focus:bg-white focus:border-blue-primary focus:ring-4 focus:ring-blue-primary/5 outline-none transition-all resize-none placeholder:text-gray-300 font-medium"
                  placeholder="How can we assist you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={clsx(
                  "w-full bg-blue-deeper text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-blue-primary hover:shadow-2xl hover:shadow-blue-primary/20 transition-all transform active:scale-[0.98]",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Transmitting...' : 'Send Message'} 
                {!isSubmitting && <Send size={16} className="-rotate-12 group-hover:rotate-0 transition-transform" />}
              </button>
            </form>
          </div>

          {/* Right Column: Info & Map */}
          <div className="flex flex-col gap-10">
            <div className="bg-blue-deeper text-white p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               {/* Abstract glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-primary/20 transition-colors"></div>
               
              <SectionHeader 
                heading="School Directory" 
                className="!mb-12 text-white [&>h2]:text-white"
              />

              <div className="space-y-10">
                {[
                  { icon: MapPin, title: 'Our Location', content: 'ST. Anne\'s Convent School, Sonepur, Odisha, India.' },
                  { icon: Phone, title: 'Call Us', content: '06654221118' },
                  { icon: Mail, title: 'Email Us', content: 'sacssnp@gmail.com' },
                  { icon: Clock, title: 'School Hours', content: 'Mon - Sat: 8:00 AM - 2:00 PM' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-6 group/item">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-yellow shrink-0 border border-white/10 group-hover/item:bg-yellow group-hover/item:text-blue-deeper transition-all duration-500">
                      <item.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg mb-1 group-hover/item:text-yellow transition-colors">{item.title}</h4>
                      <p className="text-gray-400 leading-relaxed font-medium">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Map */}
            <div 
              ref={mapRef}
              className={clsx(
                "w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative group animate-on-scroll",
                mapInView && "in-view"
              )}
            >
              <div className="absolute inset-0 bg-blue-deeper opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity z-10"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.930030509652!2d83.889890!3d20.849260!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a23a31c55555555%3A0x6eac7cbbcdbb82e3!2sSonepur%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location Map"
                className="grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
