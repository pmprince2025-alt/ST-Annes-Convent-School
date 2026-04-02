import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import SectionHeader from '../components/ui/SectionHeader';
import clsx from 'clsx';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <section className="relative w-full h-[260px] sm:h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="/building.jpg" alt="Contact Us" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2744]/70"></div>
        </div>
        <h1 className="relative z-10 font-display font-bold text-white text-[36px] sm:text-[48px] animate-fade-up px-6 text-center">Contact Us</h1>
      </section>

      <section className="section-padding max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          
          {/* Left Column: Form */}
          <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[20px] shadow-sm border border-gray-light relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-primary to-blue-dark"></div>
            
            <SectionHeader 
              label="Get In Touch" 
              heading="Send a Message" 
              subtext="Have a question about admissions or school activities? Fill out the form below."
              className="!mb-8"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-blue-dark mb-2">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-dark mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-blue-dark mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-blue-dark mb-2">Your Message *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-gray-400"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={clsx(
                  "btn-primary w-full flex items-center justify-center gap-2 mt-4",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>
            </form>
          </div>

          {/* Right Column: Info & Map */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="bg-blue-deeper text-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-[20px] shadow-lg xl:pr-20">
              <SectionHeader 
                heading="School Directory" 
                className="!mb-10 text-white [&>h2]:text-white"
              />

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg mb-1">Our Location</h4>
                    <p className="text-gray-300 leading-relaxed">ST. Anne's Convent School,<br/>Sonepur, Odisha, India.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg mb-1">Call Us</h4>
                    <p className="text-gray-300">06654221118</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg mb-1">Email Us</h4>
                    <p className="text-gray-300">sacssnp@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-yellow shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-lg mb-1">School Hours</h4>
                    <p className="text-gray-300">Monday - Saturday<br/>8:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="w-full h-56 sm:h-64 md:h-80 rounded-2xl sm:rounded-[20px] overflow-hidden shadow-sm border border-gray-light bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.930030509652!2d83.889890!3d20.849260!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a23a31c55555555%3A0x6eac7cbbcdbb82e3!2sSonepur%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location Map"
              ></iframe>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
