import React, { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    // Only initialize Lenis on client-side
    if (typeof window !== 'undefined') {
      // Dynamically import Lenis for better performance
      import('lenis').then((LenisModule) => {
        const Lenis = LenisModule.default;
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Clean up function
        return () => {
          lenis.destroy();
        };
      }).catch(error => {
        console.error('Failed to load Lenis:', error);
      });
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mb-4"></div>
          <p className="text-teal-600 font-medium">Loading MediMage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {isSignedIn ? (
          <SignedInView user={user} />
        ) : (
          <SignedOutView />
        )}
      </div>
    </div>
  );
}

function SignedInView({ user }) {
  return (
    <div className="text-center fade-in">
      <div className="mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Your health journey continues with MediMage. Access your personalized dashboard to manage appointments, 
          view medical records, and connect with healthcare professionals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        <DashboardCard
          title="Patient Dashboard"
          description="Book new appointments, view schedules, and manage your healthcare journey"
          link="/dashboard"
          icon={
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
          primary={true}
        />
        <DashboardCard
          title="Medical Records"
          description="Access your complete medical history and appointment summaries"
          link="/history"
          icon={
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <DashboardCard
          title="Find Doctors"
          description="Search and connect with verified healthcare professionals"
          link="/doctors"
          icon={
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      <QuickStats />
      
      <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-100 p-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Health Reminders</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-amber-800">Next Appointment</p>
              <p className="text-sm text-amber-600">Schedule your next visit</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Health Check</p>
              <p className="text-sm text-green-600">Annual checkup due</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignedOutView() {
  const heroRef = useRef(null);
  
  useEffect(() => {
    const handleMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      heroRef.current.style.transform = `
        perspective(1000px)
        rotateX(${y * 3}deg)
        rotateY(${x * 3}deg)
        scale3d(1.01, 1.01, 1.01)
      `;
    };
    
    const handleLeave = () => {
      heroRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    if (heroRef.current) {
      heroRef.current.addEventListener('mousemove', handleMove);
      heroRef.current.addEventListener('mouseleave', handleLeave);
    }
    
    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleMove);
        heroRef.current.removeEventListener('mouseleave', handleLeave);
      }
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with 3D effect */}
      <section 
        ref={heroRef}
        className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4 py-16 transition-transform duration-700 ease-out"
      >
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full blur-xl opacity-20 animate-ping"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">MediMage</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Your trusted partner in healthcare management. Connect with top medical professionals, 
            book appointments seamlessly, and take control of your health journey with our advanced platform.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-sm text-slate-500 ml-3">Trusted by 50,000+ patients</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-8 mb-16">
          <Link
            to="/sign-up"
            className="group px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-full hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span className="flex items-center">
              Start Your Journey
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link
            to="/about"
            className="px-10 py-4 bg-white/80 backdrop-blur-sm text-teal-600 border-2 border-teal-200 font-bold rounded-full hover:bg-white hover:border-teal-300 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Learn More
          </Link>
        </div>

        {/* Interactive Healthcare Process Cards */}
        <div className="relative w-full max-w-6xl mx-auto mt-16">
          <div className="absolute -inset-8 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-3xl blur-2xl opacity-60"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Your Healthcare Journey in 3 Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProcessCard
                step="1"
                title="Find Specialists"
                description="Browse our network of verified healthcare professionals across all medical specialties"
                icon={
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                color="from-blue-500 to-purple-500"
              />
              <ProcessCard
                step="2"
                title="Book Instantly"
                description="Schedule appointments 24/7 with real-time availability and instant confirmation"
                icon={
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                color="from-teal-500 to-cyan-500"
              />
              <ProcessCard
                step="3"
                title="Receive Care"
                description="Get quality healthcare with follow-up support and comprehensive health tracking"
                icon={
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                color="from-green-500 to-emerald-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

function ProcessCard({ step, title, description, icon, color }) {
  return (
    <div className="group relative overflow-hidden">
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-100 hover:border-teal-200 transition-all duration-500 group-hover:shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {step}
          </div>
          <div className={`text-teal-500 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { 
      number: '50,000+', 
      label: 'Patients Served', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      number: '1,500+', 
      label: 'Medical Professionals', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      number: '98.5%', 
      label: 'Satisfaction Rate', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      number: '24/7', 
      label: 'Support Available', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white opacity-5 rounded-full blur-lg"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted Healthcare Platform</h2>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of patients who trust MediMage for their healthcare needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-500 hover:bg-white/15 border border-white/20"
            >
              <div className="text-white mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-3 group-hover:text-teal-100 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-teal-100 font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Verified Healthcare Network",
      description: "Connect with board-certified doctors and specialists across all medical fields, thoroughly vetted for quality care.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Instant Booking System",
      description: "Book appointments in real-time with immediate confirmation and automated scheduling across multiple time zones.",
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "HIPAA-Compliant Security",
      description: "Your medical information is protected with bank-level encryption and strict compliance with healthcare privacy laws.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM9.06 9.06L5.636 5.636a1.414 1.414 0 11-2-2l3.536-3.536a1.414 1.414 0 012 0l3.536 3.536a1.414 1.414 0 01-2 2z" />
        </svg>
      ),
      title: "Smart Notifications",
      description: "Receive intelligent reminders, health tips, and appointment updates via SMS, email, or push notifications.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "Telehealth Integration",
      description: "Access virtual consultations with HD video calls and secure messaging for convenient remote healthcare.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Health Analytics",
      description: "Track your health journey with personalized insights, appointment history, and wellness recommendations.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Advanced Healthcare Features
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Experience next-generation healthcare management with our comprehensive suite of features designed for modern patients and providers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden bg-white rounded-2xl p-8 border border-slate-100 hover:border-teal-200 transition-all duration-500 hover:shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-45 translate-x-8 -translate-y-8">
                <div className={`w-full h-full bg-gradient-to-r ${feature.color} rounded-lg`}></div>
              </div>
              
              <div className={`text-teal-500 mb-6 group-hover:scale-110 transition-all duration-300 relative z-10`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-teal-700 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                {feature.description}
              </p>
              
              <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${feature.color} group-hover:w-full transition-all duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Working Mother",
      content: "MediMage transformed how I manage my family's healthcare. The instant booking and reminder system saved us so much time and stress.",
      avatar: (
        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
          SJ
        </div>
      ),
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist, Metro Hospital",
      content: "As a healthcare provider, MediMage has streamlined my practice management beautifully. The platform is intuitive and my patients love the convenience.",
      avatar: (
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
          MC
        </div>
      ),
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Senior Patient",
      content: "The telehealth features are incredible. I can now consult with specialists without traveling, and the support team is always helpful.",
      avatar: (
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
          JW
        </div>
      ),
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied patients and healthcare providers who trust MediMage for their medical needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 hover:bg-white"
            >
              <div className="flex items-center mb-6">
                {testimonial.avatar}
                <div className="ml-4">
                  <div className="font-bold text-slate-800 text-lg">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              
              <p className="text-slate-600 italic leading-relaxed mb-4 group-hover:text-slate-700 transition-colors duration-300">
                "{testimonial.content}"
              </p>
              
              <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"></div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-full px-8 py-4 border border-white/80">
            <div className="flex -space-x-2 mr-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-slate-600">+50K</span>
              </div>
            </div>
            <span className="text-slate-700 font-semibold">Join our growing healthcare community</span>
            <span className="text-slate-700 font-semibold">Join our growing healthcare community</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-xl"></div>
        </div>
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of patients who have discovered a better way to manage their health. 
            Start your journey with MediMage today.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link
            to="/sign-up"
            className="group px-12 py-5 text-xl font-bold text-teal-600 bg-white rounded-full hover:bg-teal-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <span className="flex items-center">
              Get Started Now
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          
          <Link
            to="/doctors"
            className="px-12 py-5 text-xl font-bold text-white border-2 border-white/30 rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
          >
            Browse Doctors
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-teal-100 font-medium">No signup fees</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-teal-100 font-medium">Secure & Private</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-teal-100 font-medium">Instant Access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardCard({ title, description, link, icon, primary = false }) {
  const baseClasses = "group relative overflow-hidden p-8 rounded-2xl shadow-lg border transition-all duration-500 transform hover:scale-105";
  const cardClasses = primary 
    ? `${baseClasses} bg-gradient-to-br from-teal-600 to-cyan-600 text-white border-teal-200 hover:shadow-2xl`
    : `${baseClasses} bg-white/80 backdrop-blur-sm text-slate-800 border-white/50 hover:bg-white hover:shadow-xl`;

  return (
    <Link to={link} className={cardClasses}>
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform rotate-45 translate-x-6 -translate-y-6">
        <div className={`w-full h-full ${primary ? 'bg-white' : 'bg-teal-500'} rounded-lg`}></div>
      </div>
      
      <div className={`${primary ? 'text-teal-100' : 'text-teal-500'} mb-6 group-hover:scale-110 transition-all duration-300 relative z-10`}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold mb-4 relative z-10">{title}</h3>
      
      <p className={`text-base ${primary ? 'text-teal-50' : 'text-slate-600'} leading-relaxed mb-6 relative z-10 group-hover:${primary ? 'text-white' : 'text-slate-700'} transition-colors duration-300`}>
        {description}
      </p>
      
      <div className="flex items-center relative z-10">
        <span className={`font-semibold ${primary ? 'text-teal-100' : 'text-teal-600'} group-hover:${primary ? 'text-white' : 'text-teal-700'} transition-colors duration-300`}>
          Access Now
        </span>
        <svg className={`ml-2 w-5 h-5 ${primary ? 'text-teal-100' : 'text-teal-600'} group-hover:translate-x-1 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Link>
  );
}

function QuickStats() {
  return (
    <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 fade-in">
      <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Your Health Dashboard</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          number="0" 
          label="Upcoming Appointments" 
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard 
          number="0" 
          label="Completed Visits" 
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          number="0" 
          label="Saved Doctors" 
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

function StatCard({ number, label, color, icon }) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200'
  };

  return (
    <div className={`group p-6 rounded-xl ${colorClasses[color]} border fade-in transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-bold">{number}</div>
        <div className="group-hover:scale-110 transition-transform duration-300">{icon}</div>
      </div>
      <div className="text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-300">{label}</div>
    </div>
  );
}

// Enhanced CSS animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(1deg); }
    75% { transform: translateY(-3px) rotate(-1deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
    50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.5), 0 0 60px rgba(20, 184, 166, 0.3); }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }
  
  .fade-in {
    animation: fadeIn 1s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(30px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0px) scale(1); 
    }
  }
  
  .card-hover {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-8px) scale(1.02);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-pulse-glow,
    .animate-gradient {
      animation: none;
    }
  }
`;

// Inject enhanced styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  if (!document.head.querySelector('[data-medimage-styles]')) {
    styleSheet.setAttribute('data-medimage-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}