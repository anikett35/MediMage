import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [scrollY, setScrollY] = useState(0);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="flex flex-col items-center relative z-10">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-teal-200 border-t-teal-600 shadow-2xl"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 blur-lg opacity-20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
              Loading MediMage...
            </p>
            <div className="mt-3 flex justify-center space-x-1">
              <div className="h-2 w-2 bg-teal-500 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-teal-500 rounded-full animate-bounce delay-150"></div>
              <div className="h-2 w-2 bg-teal-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Animated background elements that respond to scroll */}
      <div 
        className="absolute inset-0 opacity-40 will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-3xl animate-blob will-change-transform"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.005) * 30}px, ${Math.cos(scrollY * 0.005) * 20}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl animate-blob animation-delay-2000 will-change-transform"
            style={{
              transform: `translate(${Math.cos(scrollY * 0.004) * 25}px, ${Math.sin(scrollY * 0.004) * 15}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-3xl animate-blob animation-delay-4000 will-change-transform"
            style={{
              transform: `translate(-50%, -50%) translate(${Math.sin(scrollY * 0.006) * 40}px, ${Math.cos(scrollY * 0.006) * 25}px)`
            }}
          ></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {isSignedIn ? (
          <SignedInView user={user} scrollY={scrollY} />
        ) : (
          <SignedOutView scrollY={scrollY} />
        )}
      </div>
    </div>
  );
}

function SignedInView({ user, scrollY }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="text-center animate-fade-in-up overflow-hidden pt-16">
      <div 
        className="mb-16 relative will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.06), transparent 40%)`
          }}
        />
        
        <div className="flex items-center justify-center mb-8 relative">
          <div className="group relative">
            <div 
              className="w-24 h-24 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-700 hover:scale-110 hover:rotate-12 animate-float will-change-transform"
              style={{
                transform: `scale(${1 + Math.sin(scrollY * 0.005) * 0.05}) rotate(${scrollY * 0.05}deg)`
              }}
            >
              <svg className="w-12 h-12 text-white transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="absolute -inset-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute -inset-8 bg-gradient-to-r from-teal-300 to-cyan-400 rounded-full blur-3xl opacity-20 animate-ping"></div>
          </div>
        </div>
        
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in-up animation-delay-300 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.03}px)`
          }}
        >
          <span className="inline-block transform transition-all duration-300 hover:scale-105">Welcome back,</span>
          <br />
          <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300% inline-block transform transition-all duration-300 hover:scale-105">
            {user.firstName}
          </span>
        </h1>
        
        <p 
          className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.04}px)`
          }}
        >
          Manage your health appointments with top doctors. Access your medical records and 
          schedule consultations with certified healthcare professionals.
        </p>
      </div>

      {/* Enhanced Dashboard with medical features */}
      <div 
        className="mt-16 relative animate-fade-in-up animation-delay-700 will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.06}px) scale(${1 + Math.sin(scrollY * 0.003) * 0.02})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-3xl blur-3xl opacity-10 animate-pulse"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-10 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 flex items-center justify-center flex-wrap">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-3 animate-pulse flex-shrink-0"></div>
            Your Medical Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <MedicalCard
              title="Book Appointment"
              subtitle="Schedule with doctors"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              color="teal"
            />
            <MedicalCard
              title="Medical Records"
              subtitle="View health history"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              color="cyan"
            />
            <MedicalCard
              title="Find Doctors"
              subtitle="Search specialists"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              color="blue"
            />
            <MedicalCard
              title="Prescriptions"
              subtitle="Manage medications"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              color="purple"
            />
          </div>
        </div>
      </div>
      
      {/* Medical Stats section */}
      <MedicalStats scrollY={scrollY} />
    </div>
  );
}

function MedicalCard({ title, subtitle, icon, color }) {
  const colorClasses = {
    teal: {
      bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      border: 'border-teal-200',
      iconBg: 'bg-gradient-to-r from-teal-500 to-cyan-500',
      textPrimary: 'text-teal-800',
      textSecondary: 'text-teal-600',
      shadow: 'shadow-teal-100'
    },
    cyan: {
      bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
      border: 'border-cyan-200',
      iconBg: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      textPrimary: 'text-cyan-800',
      textSecondary: 'text-cyan-600',
      shadow: 'shadow-cyan-100'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      textPrimary: 'text-blue-800',
      textSecondary: 'text-blue-600',
      shadow: 'shadow-blue-100'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      border: 'border-purple-200',
      iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textPrimary: 'text-purple-800',
      textSecondary: 'text-purple-600',
      shadow: 'shadow-purple-100'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`group flex items-center p-4 md:p-6 ${classes.bg} rounded-2xl border ${classes.border} ${classes.shadow} shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}>
      <div className={`w-12 h-12 md:w-14 md:h-14 ${classes.iconBg} rounded-2xl flex items-center justify-center mr-4 md:mr-6 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-bold text-base md:text-lg ${classes.textPrimary} transition-colors duration-300`}>{title}</p>
        <p className={`text-xs md:text-sm ${classes.textSecondary} transition-colors duration-300`}>{subtitle}</p>
      </div>
    </div>
  );
}

function SignedOutView({ scrollY }) {
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      heroRef.current.style.transform = `
        perspective(1500px)
        rotateX(${y * 1}deg)
        rotateY(${x * 1}deg)
        scale3d(1.01, 1.01, 1.01)
        translateY(${scrollY * 0.05}px)
      `;
    };
    
    const handleLeave = () => {
      if (!heroRef.current) return;
      heroRef.current.style.transform = `perspective(1500px) rotateX(0) rotateY(0) translateY(${scrollY * 0.05}px)`;
    };
    
    if (heroRef.current) {
      heroRef.current.addEventListener('mousemove', handleMove, { passive: true });
      heroRef.current.addEventListener('mouseleave', handleLeave, { passive: true });
    }
    
    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleMove);
        heroRef.current.removeEventListener('mouseleave', handleLeave);
      }
    };
  }, [scrollY]);

  return (
    <div className="overflow-hidden">
      {/* Enhanced Hero Section for Medical Platform */}
      <section 
        ref={heroRef}
        className={`min-h-[90vh] flex flex-col justify-center items-center text-center px-4 py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div 
          className="mb-16 relative will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.08}px)`
          }}
        >
          <div className="flex items-center justify-center mb-12">
            <div className="group relative">
              <div 
                className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000 hover:scale-110 animate-float will-change-transform"
                style={{
                  transform: `scale(${1 + Math.sin(scrollY * 0.003) * 0.05}) rotate(${scrollY * 0.05}deg)`
                }}
              >
                <svg className="w-14 h-14 md:w-16 md:h-16 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="absolute -inset-8 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-full blur-3xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="absolute -inset-12 bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 rounded-full blur-3xl opacity-20 animate-ping"></div>
              <div className="absolute -inset-6 bg-gradient-to-r from-white to-teal-100 rounded-full blur-2xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <h1 
            className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 leading-tight will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`
            }}
          >
            <span className="inline-block transform transition-all duration-500 hover:scale-105 animate-fade-in-up">
              MediMage
            </span>
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300% inline-block transform transition-all duration-500 hover:scale-105 animate-fade-in-up animation-delay-300">
              Doctor Appointments
            </span>
          </h1>
          
          <p 
            className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-600 will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.06}px)`
            }}
          >
            Connect with certified doctors and healthcare professionals. Book appointments, 
            manage your medical records, and take control of your health journey with our innovative platform.
          </p>
          
          <div 
            className="flex items-center justify-center gap-3 mb-10 animate-fade-in-up animation-delay-800 will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.04}px)`
            }}
          >
            <div className="flex -space-x-3">
              {[
                'from-teal-400 to-cyan-400',
                'from-cyan-400 to-blue-400',
                'from-blue-400 to-teal-400',
                'from-teal-500 to-cyan-500',
                'from-cyan-500 to-blue-500'
              ].map((gradient, index) => (
                <div 
                  key={index}
                  className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${gradient} rounded-full border-2 md:border-3 border-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:z-10 animate-bounce will-change-transform`}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    transform: `scale(${1 + Math.sin((scrollY + index * 100) * 0.005) * 0.05})`
                  }}
                />
              ))}
            </div>
            <span className="text-sm md:text-base text-slate-500 ml-4 font-medium">
              Join <span className="font-bold text-teal-600">50,000+</span> patients worldwide
            </span>
          </div>
        </div>

        <div 
          className="flex flex-col sm:flex-row gap-6 md:gap-8 mt-8 mb-20 animate-fade-in-up animation-delay-1000 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.03}px)`
          }}
        >
          <button className="group relative px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
            <span className="relative flex items-center text-base md:text-lg">
              Book Appointment
              <svg className="ml-3 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button className="group relative px-10 md:px-12 py-4 md:py-5 bg-white/90 backdrop-blur-xl text-teal-600 border-2 border-teal-200 font-bold rounded-full shadow-xl transform transition-all duration-500 hover:scale-105 hover:bg-white hover:border-teal-300 hover:shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative text-base md:text-lg">Find Doctors</span>
          </button>
        </div>

        {/* Medical Services Cards */}
        <div 
          className="relative w-full max-w-7xl mx-auto mt-20 animate-fade-in-up animation-delay-1200 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.02}px) scale(${1 + Math.sin(scrollY * 0.002) * 0.01})`
          }}
        >
          <div className="absolute -inset-12 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 rounded-3xl blur-3xl opacity-40 animate-pulse"></div>
          
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl">
            <h3 className="text-2xl md:text-4xl font-bold text-slate-800 mb-8 md:mb-12 text-center flex items-center justify-center flex-wrap">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-3 md:mr-4 animate-pulse flex-shrink-0"></div>
              Healthcare Services
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <MedicalProcessCard
                step="1"
                title="Find Doctor"
                description="Search and browse through our network of certified doctors and specialists"
                icon={
                  <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                color="from-teal-500 via-teal-600 to-cyan-600"
                delay="0"
                scrollY={scrollY}
              />
              <MedicalProcessCard
                step="2"
                title="Book Appointment"
                description="Schedule your consultation at your preferred time with instant confirmation"
                icon={
                  <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                color="from-cyan-500 via-cyan-600 to-blue-600"
                delay="200"
                scrollY={scrollY}
              />
              <MedicalProcessCard
                step="3"
                title="Get Treatment"
                description="Receive quality healthcare and follow-up care from our trusted medical professionals"
                icon={
                  <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                color="from-blue-500 via-blue-600 to-teal-600"
                delay="400"
                scrollY={scrollY}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Medical Stats Section */}
      <MedicalStatsSection scrollY={scrollY} />

      {/* Medical Specialties Section */}
      <MedicalSpecialties scrollY={scrollY} />

      {/* Doctor Testimonials Section */}
      <DoctorTestimonials scrollY={scrollY} />

      {/* Medical CTA Section */}
      <MedicalCTASection scrollY={scrollY} />
    </div>
  );
}

function MedicalProcessCard({ step, title, description, icon, color, delay, scrollY }) {
  return (
    <div 
      className="group relative overflow-hidden animate-fade-in-up will-change-transform"
      style={{ 
        animationDelay: `${delay}ms`,
        transform: `translateY(${Math.sin((scrollY + parseInt(delay)) * 0.002) * 5}px)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl transform transition-all duration-700 group-hover:scale-105"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-slate-100 group-hover:border-teal-200 transition-all duration-500 group-hover:shadow-2xl transform group-hover:-translate-y-2">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0`}>
            {step}
          </div>
          <div className="text-teal-500 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
            {icon}
          </div>
        </div>
        
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-3 md:mb-4 group-hover:text-teal-700 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-sm md:text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
          {description}
        </p>
        
        <div className={`absolute bottom-0 left-0 h-2 w-0 bg-gradient-to-r ${color} rounded-full group-hover:w-full transition-all duration-700`}></div>
      </div>
    </div>
  );
}

function MedicalStatsSection({ scrollY }) {
  const stats = [
    { 
      number: '50,000+', 
      label: 'Patients Served', 
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      number: '1,200+', 
      label: 'Expert Doctors', 
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      number: '25+', 
      label: 'Specialties', 
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      number: '24/7', 
      label: 'Medical Support', 
      icon: (
        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden will-change-transform"
      style={{
        transform: `translateY(${scrollY * 0.03}px)`
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div 
            className="absolute top-10 left-10 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full blur-3xl animate-blob will-change-transform"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.005) * 20}px, ${Math.cos(scrollY * 0.005) * 15}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-10 right-10 w-48 h-48 md:w-64 md:h-64 bg-white rounded-full blur-3xl animate-blob animation-delay-2000 will-change-transform"
            style={{
              transform: `translate(${Math.cos(scrollY * 0.004) * 25}px, ${Math.sin(scrollY * 0.004) * 18}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/3 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full blur-2xl animate-blob animation-delay-4000 will-change-transform"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.006) * 30}px, ${Math.cos(scrollY * 0.006) * 20}px)`
            }}
          ></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 animate-fade-in-up will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.04}px)`
            }}
          >
            <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Trusted by Thousands
            </span>
          </h2>
          <p 
            className="text-lg md:text-xl lg:text-2xl text-teal-100 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300 will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`
            }}
          >
            Join our growing community of patients and healthcare professionals
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 text-center transform transition-all duration-700 hover:scale-110 hover:bg-white/20 border border-white/30 hover:border-white/50 shadow-2xl animate-fade-in-up will-change-transform"
              style={{ 
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.003) * 8}px) ${scrollY > 0 ? 'scale(1.02)' : 'scale(1)'}`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-white mb-6 md:mb-8 flex justify-center group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                <div className="p-3 md:p-4 bg-white/20 rounded-xl md:rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                  {stat.icon}
                </div>
              </div>
              
              <div className="relative text-2xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-4 group-hover:text-teal-100 transition-colors duration-300 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                {stat.number}
              </div>
              
              <div className="relative text-xs md:text-sm text-teal-100 font-semibold opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                {stat.label}
              </div>
              
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-white to-teal-100 rounded-full group-hover:w-3/4 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MedicalSpecialties({ scrollY }) {
  const specialties = [
    {
      icon: (
        <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Cardiology",
      description: "Heart and cardiovascular system specialists for comprehensive cardiac care and treatment.",
      color: "from-red-500 via-red-600 to-pink-600"
    },
    {
      icon: (
        <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Neurology",
      description: "Brain and nervous system experts providing advanced neurological care and diagnosis.",
      color: "from-purple-500 via-purple-600 to-indigo-600"
    },
    {
      icon: (
        <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "Pediatrics",
      description: "Specialized healthcare for children from infancy through adolescence with compassionate care.",
      color: "from-green-500 via-green-600 to-emerald-600"
    },
    {
      icon: (
        <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Orthopedics",
      description: "Bone, joint, and muscle specialists for injuries, conditions, and surgical treatments.",
      color: "from-orange-500 via-orange-600 to-red-600"
    },
    {
      icon: (
        <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: "Ophthalmology",
      description: "Eye care specialists providing comprehensive vision care and advanced eye treatments.",
      color: "from-blue-500 via-blue-600 to-cyan-600"
    },
    {
      icon: (
        <svg className="h-10 w-10 md:h-12 md:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "Dermatology",
      description: "Skin health experts for medical and cosmetic dermatological treatments and care.",
      color: "from-teal-500 via-cyan-500 to-blue-500"
    }
  ];

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50 relative overflow-hidden will-change-transform"
      style={{
        transform: `translateY(${scrollY * 0.02}px)`
      }}
    >
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-3xl animate-blob will-change-transform"
          style={{
            transform: `translate(${Math.sin(scrollY * 0.003) * 25}px, ${Math.cos(scrollY * 0.003) * 20}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl animate-blob animation-delay-2000 will-change-transform"
          style={{
            transform: `translate(${Math.cos(scrollY * 0.004) * 30}px, ${Math.sin(scrollY * 0.004) * 15}px)`
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 
            className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-6 md:mb-8 animate-fade-in-up will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`
            }}
          >
            <span className="bg-gradient-to-r from-slate-800 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Medical Specialties
            </span>
          </h2>
          <p 
            className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300 will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.02}px)`
            }}
          >
            Connect with certified specialists across all major medical fields for expert healthcare.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {specialties.map((specialty, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-8 md:p-10 border border-white/50 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up will-change-transform"
              style={{ 
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.002) * 5}px)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-3xl"></div>
              
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-5 transform rotate-45 translate-x-6 -translate-y-6 md:translate-x-8 md:-translate-y-8">
                <div className={`w-full h-full bg-gradient-to-r ${specialty.color} rounded-2xl group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-teal-500 mb-6 md:mb-8 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 flex">
                  <div className="p-3 md:p-4 bg-teal-50 rounded-xl md:rounded-2xl group-hover:bg-teal-100 transition-colors duration-300">
                    {specialty.icon}
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 group-hover:text-teal-700 transition-colors duration-300">
                  {specialty.title}
                </h3>
                
                <p className="text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                  {specialty.description}
                </p>
                
                <div className={`absolute bottom-0 left-0 h-2 w-0 bg-gradient-to-r ${specialty.color} rounded-full group-hover:w-full transition-all duration-700`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorTestimonials({ scrollY }) {
  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      content: "MediMage has revolutionized how I connect with patients. The platform is intuitive and helps me provide better care to more people.",
      avatar: (
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl">
          SJ
        </div>
      ),
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "Pediatrician",
      content: "The scheduling system is fantastic and my patients love how easy it is to book appointments. It's made my practice much more efficient.",
      avatar: (
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl">
          MC
        </div>
      ),
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Dermatologist",
      content: "Patient management has never been easier. The digital records system helps me track treatments and provide personalized care.",
      avatar: (
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-xl">
          ER
        </div>
      ),
      rating: 5
    }
  ];

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden will-change-transform"
      style={{
        transform: `translateY(${scrollY * 0.015}px)`
      }}
    >
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-1/4 left-1/4 w-60 h-60 md:w-72 md:h-72 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full blur-3xl animate-blob will-change-transform"
          style={{
            transform: `translate(${Math.sin(scrollY * 0.003) * 40}px, ${Math.cos(scrollY * 0.003) * 25}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full blur-3xl animate-blob animation-delay-4000 will-change-transform"
          style={{
            transform: `translate(${Math.cos(scrollY * 0.004) * 30}px, ${Math.sin(scrollY * 0.004) * 25}px)`
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 
            className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-6 md:mb-8 animate-fade-in-up will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.02}px)`
            }}
          >
            <span className="bg-gradient-to-r from-slate-800 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              What Doctors Say
            </span>
          </h2>
          <p 
            className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300 will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`
            }}
          >
            Healthcare professionals trust MediMage to enhance their practice and patient care.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-xl border border-white/50 transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up will-change-transform"
              style={{ 
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 150) * 0.002) * 6}px)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl md:rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-6 md:mb-8">
                  <div className="transform transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4 md:ml-6 min-w-0 flex-1">
                    <div className="font-bold text-slate-800 text-lg md:text-xl group-hover:text-teal-700 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-500 text-xs md:text-sm mt-1">{testimonial.role}</div>
                  </div>
                </div>
                
                <div className="flex mb-4 md:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current transform transition-all duration-300 group-hover:scale-110" viewBox="0 0 20 20" style={{ animationDelay: `${i * 100}ms` }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                
                <p className="text-sm md:text-base lg:text-lg text-slate-600 italic leading-relaxed mb-4 md:mb-6 group-hover:text-slate-700 transition-colors duration-300">
                  "{testimonial.content}"
                </p>
                
                <div className="w-12 h-1 md:w-16 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full group-hover:w-20 md:group-hover:w-24 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className="text-center mt-12 md:mt-16 animate-fade-in-up animation-delay-800 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.02}px)`
          }}
        >
          <div className="inline-flex items-center bg-white/80 backdrop-blur-xl rounded-full px-8 md:px-10 py-4 md:py-6 border border-white/50 shadow-xl transform transition-all duration-500 hover:scale-105 hover:bg-white">
            <div className="flex -space-x-2 md:-space-x-3 mr-4 md:mr-6">
              {[
                'from-teal-400 to-cyan-400',
                'from-cyan-400 to-blue-400',
                'from-blue-400 to-teal-400',
                'from-teal-500 to-cyan-500',
                'from-cyan-500 to-blue-500'
              ].map((gradient, index) => (
                <div 
                  key={index}
                  className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${gradient} rounded-full border-2 md:border-3 border-white shadow-lg transform transition-all duration-300 hover:scale-110 animate-float will-change-transform`}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    transform: `scale(${1 + Math.sin((scrollY + index * 100) * 0.004) * 0.05})`
                  }}
                />
              ))}
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-full border-2 md:border-3 border-white flex items-center justify-center shadow-lg">
                <span className="text-xs md:text-sm font-bold text-slate-600">+1.2K</span>
              </div>
            </div>
            <span className="text-slate-700 font-bold text-sm md:text-lg">
              Join our network of doctors
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MedicalCTASection({ scrollY }) {
  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden will-change-transform"
      style={{
        transform: `translateY(${scrollY * 0.01}px)`
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-15">
          <div 
            className="absolute top-10 right-10 w-60 h-60 md:w-80 md:h-80 bg-white rounded-full blur-3xl animate-blob will-change-transform"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.002) * 30}px, ${Math.cos(scrollY * 0.002) * 20}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-10 left-10 w-72 h-72 md:w-96 md:h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000 will-change-transform"
            style={{
              transform: `translate(${Math.cos(scrollY * 0.003) * 40}px, ${Math.sin(scrollY * 0.003) * 25}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full blur-2xl animate-blob animation-delay-4000 will-change-transform"
            style={{
              transform: `translate(-50%, -50%) translate(${Math.sin(scrollY * 0.004) * 50}px, ${Math.cos(scrollY * 0.004) * 25}px)`
            }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700/30 to-blue-700/30"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
        <div className="mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight animate-fade-in-up will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.02}px)`
            }}
          >
            <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Your Health Journey Starts Here
            </span>
          </h2>
          <p 
            className="text-lg md:text-xl lg:text-2xl text-teal-100 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300 will-change-transform"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`
            }}
          >
            Connect with expert doctors, manage your health records, and experience healthcare 
            management like never before. Start your journey today.
          </p>
        </div>
        
        <div 
          className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center mb-12 md:mb-16 animate-fade-in-up animation-delay-600 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.01}px)`
          }}
        >
          <button className="group relative px-12 md:px-16 py-4 md:py-6 text-lg md:text-xl font-bold text-teal-600 bg-white rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-teal-100 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
            <span className="relative flex items-center">
              Book Appointment Now
              <svg className="ml-3 md:ml-4 w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button className="group relative px-12 md:px-16 py-4 md:py-6 text-lg md:text-xl font-bold text-white border-2 border-white/40 rounded-full transform transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/70 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-teal-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <span className="relative">Find Doctors</span>
          </button>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto animate-fade-in-up animation-delay-900 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.02}px)`
          }}
        >
          {[
            { icon: "M5 13l4 4L19 7", text: "Instant Booking" },
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "HIPAA Compliant" },
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "24/7 Access" }
          ].map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center animate-fade-in-up will-change-transform" 
              style={{ 
                animationDelay: `${900 + index * 200}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.003) * 6}px)`
              }}
            >
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 mx-auto transform transition-all duration-500 hover:scale-110 hover:bg-white/30 border border-white/30">
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <p className="text-teal-100 font-bold text-sm md:text-lg">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MedicalStats({ scrollY }) {
  return (
    <div 
      className="mt-16 md:mt-20 relative animate-fade-in-up animation-delay-1000 will-change-transform"
      style={{
        transform: `translateY(${scrollY * 0.04}px) scale(${1 + Math.sin(scrollY * 0.003) * 0.01})`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl md:rounded-3xl blur-3xl opacity-10 animate-pulse"></div>
      
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 md:mb-10 text-center flex items-center justify-center flex-wrap">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-3 animate-pulse flex-shrink-0"></div>
          Your Health Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <MedicalStatCard 
            number="0" 
            label="Appointments Booked" 
            color="teal"
            icon={
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            scrollY={scrollY}
          />
          <MedicalStatCard 
            number="0" 
            label="Health Records" 
            color="cyan"
            icon={
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            scrollY={scrollY}
          />
          <MedicalStatCard 
            number="0" 
            label="Doctors Connected" 
            color="blue"
            icon={
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            scrollY={scrollY}
          />
        </div>
      </div>
    </div>
  );
}

function MedicalStatCard({ number, label, color, icon, scrollY }) {
  const colorClasses = {
    teal: 'text-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 shadow-teal-100',
    cyan: 'text-cyan-600 bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 shadow-cyan-100',
    blue: 'text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-blue-100'
  };

  return (
    <div 
      className={`group p-6 md:p-8 rounded-xl md:rounded-2xl ${colorClasses[color]} border shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 will-change-transform`}
      style={{
        transform: `translateY(${Math.sin((scrollY + (color === 'teal' ? 0 : color === 'cyan' ? 100 : 200)) * 0.004) * 3}px)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="text-3xl md:text-4xl font-black group-hover:scale-110 transition-transform duration-300">{number}</div>
          <div className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{icon}</div>
        </div>
        <div className="text-xs md:text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity duration-300">{label}</div>
      </div>
    </div>
  );
}

// Enhanced CSS animations with better performance
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-6px) rotate(0.5deg); }
    50% { transform: translateY(-3px) rotate(0deg); }
    75% { transform: translateY(-4px) rotate(-0.5deg); }
  }
  
  @keyframes blob {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(20px, -30px) scale(1.05); }
    66% { transform: translate(-15px, 15px) scale(0.95); }
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes fade-in-up {
    from { 
      opacity: 0; 
      transform: translateY(30px) scale(0.98); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0px) scale(1); 
    }
  }
  
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  
  .animate-blob {
    animation: blob 6s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 300% 300%;
    animation: gradient 6s ease infinite;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
    opacity: 0;
  }
  
  .animation-delay-150 { animation-delay: 150ms; }
  .animation-delay-300 { animation-delay: 300ms; }
  .animation-delay-500 { animation-delay: 500ms; }
  .animation-delay-700 { animation-delay: 700ms; }
  .animation-delay-800 { animation-delay: 800ms; }
  .animation-delay-1000 { animation-delay: 1000ms; }
  .animation-delay-1200 { animation-delay: 1200ms; }
  .animation-delay-2000 { animation-delay: 2000ms; }
  .animation-delay-4000 { animation-delay: 4000ms; }
  
  .bg-300% { background-size: 300% 300%; }
  .border-3 { border-width: 3px; }
  
  .shadow-3xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .will-change-transform {
    will-change: transform;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-blob,
    .animate-gradient,
    .animate-fade-in-up {
      animation: none !important;
    }
    
    .animate-fade-in-up {
      opacity: 1;
    }
    
    .will-change-transform {
      will-change: auto;
    }
    
    * {
      transform: none !important;
    }
  }
  
  /* Performance optimizations */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
