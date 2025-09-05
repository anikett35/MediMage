import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [scrollY, setScrollY] = useState(0);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

        return () => {
          lenis.destroy();
        };
      }).catch(error => {
        console.error('Failed to load Lenis:', error);
      });
    }

    // Scroll animation handler
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
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
              Loading...
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
        className="absolute inset-0 opacity-40"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <div 
            className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-3xl animate-blob"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.01) * 50}px, ${Math.cos(scrollY * 0.01) * 30}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl animate-blob animation-delay-2000"
            style={{
              transform: `translate(${Math.cos(scrollY * 0.008) * 40}px, ${Math.sin(scrollY * 0.008) * 20}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-3xl animate-blob animation-delay-4000"
            style={{
              transform: `translate(-50%, -50%) translate(${Math.sin(scrollY * 0.012) * 60}px, ${Math.cos(scrollY * 0.012) * 40}px)`
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
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="text-center animate-fade-in-up overflow-hidden pt-16">
      <div 
        className="mb-16 relative"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`
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
              className="w-24 h-24 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-700 hover:scale-110 hover:rotate-12 animate-float"
              style={{
                transform: `scale(${1 + Math.sin(scrollY * 0.01) * 0.1}) rotate(${scrollY * 0.1}deg)`
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
          className="text-6xl md:text-7xl font-black mb-6 animate-fade-in-up animation-delay-300"
          style={{
            transform: `translateY(${scrollY * 0.05}px)`
          }}
        >
          <span className="inline-block transform transition-all duration-300 hover:scale-105">Welcome back,</span>
          <br />
          <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300% inline-block transform transition-all duration-300 hover:scale-105">
            {user.firstName}
          </span>
        </h1>
        
        <p 
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-500"
          style={{
            transform: `translateY(${scrollY * 0.08}px)`
          }}
        >
          Continue your journey with us. Explore our platform and discover amazing features 
          designed to enhance your experience.
        </p>
      </div>

      {/* Scroll-reactive welcome section */}
      <div 
        className="mt-16 relative animate-fade-in-up animation-delay-700"
        style={{
          transform: `translateY(${scrollY * 0.12}px) scale(${1 + Math.sin(scrollY * 0.005) * 0.05})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-3xl blur-3xl opacity-10 animate-pulse"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          <h3 className="text-3xl font-bold text-slate-800 mb-8 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-3 animate-pulse"></div>
            Your Dashboard
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <WelcomeCard
              title="Explore Features"
              subtitle="Discover what's new"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              color="teal"
            />
            <WelcomeCard
              title="Quick Access"
              subtitle="Jump to your favorites"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              color="cyan"
            />
          </div>
        </div>
      </div>
      
      {/* Animated stats section */}
      <QuickStats scrollY={scrollY} />
    </div>
  );
}

function WelcomeCard({ title, subtitle, icon, color }) {
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
    }
  };

  const classes = colorClasses[color];

  return (
    <div className={`group flex items-center p-6 ${classes.bg} rounded-2xl border ${classes.border} ${classes.shadow} shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}>
      <div className={`w-14 h-14 ${classes.iconBg} rounded-2xl flex items-center justify-center mr-6 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
        {icon}
      </div>
      <div>
        <p className={`font-bold text-lg ${classes.textPrimary} transition-colors duration-300`}>{title}</p>
        <p className={`text-sm ${classes.textSecondary} transition-colors duration-300`}>{subtitle}</p>
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
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      heroRef.current.style.transform = `
        perspective(1500px)
        rotateX(${y * 2}deg)
        rotateY(${x * 2}deg)
        scale3d(1.01, 1.01, 1.01)
        translateY(${scrollY * 0.1}px)
      `;
    };
    
    const handleLeave = () => {
      heroRef.current.style.transform = `perspective(1500px) rotateX(0) rotateY(0) translateY(${scrollY * 0.1}px)`;
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
  }, [scrollY]);

  return (
    <div className="overflow-hidden">
      {/* Enhanced Hero Section with scroll effects */}
      <section 
        ref={heroRef}
        className={`min-h-[90vh] flex flex-col justify-center items-center text-center px-4 py-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div 
          className="mb-16 relative"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        >
          <div className="flex items-center justify-center mb-12">
            <div className="group relative">
              <div 
                className="w-32 h-32 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000 hover:scale-110 animate-float"
                style={{
                  transform: `scale(${1 + Math.sin(scrollY * 0.005) * 0.1}) rotate(${scrollY * 0.1}deg)`
                }}
              >
                <svg className="w-16 h-16 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -inset-8 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-full blur-3xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="absolute -inset-12 bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 rounded-full blur-3xl opacity-20 animate-ping"></div>
              <div className="absolute -inset-6 bg-gradient-to-r from-white to-teal-100 rounded-full blur-2xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <h1 
            className="text-6xl md:text-8xl font-black mb-8 leading-tight"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`
            }}
          >
            <span className="inline-block transform transition-all duration-500 hover:scale-105 animate-fade-in-up">
              Welcome to
            </span>
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-300% inline-block transform transition-all duration-500 hover:scale-105 animate-fade-in-up animation-delay-300">
              Our Platform
            </span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-600"
            style={{
              transform: `translateY(${scrollY * 0.12}px)`
            }}
          >
            Discover amazing features and take your experience to the next level. 
            Connect, explore, and achieve your goals with our innovative platform designed for the modern world.
          </p>
          
          <div 
            className="flex items-center justify-center gap-3 mb-10 animate-fade-in-up animation-delay-800"
            style={{
              transform: `translateY(${scrollY * 0.08}px)`
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
                  className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-full border-3 border-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:z-10 animate-bounce`}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    transform: `scale(${1 + Math.sin((scrollY + index * 100) * 0.01) * 0.1})`
                  }}
                />
              ))}
            </div>
            <span className="text-base text-slate-500 ml-4 font-medium">
              Join <span className="font-bold text-teal-600">10,000+</span> users worldwide
            </span>
          </div>
        </div>

        <div 
          className="flex flex-col sm:flex-row gap-8 mt-8 mb-20 animate-fade-in-up animation-delay-1000"
          style={{
            transform: `translateY(${scrollY * 0.06}px)`
          }}
        >
          <p className="group relative px-12 py-5 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white font-bold rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-3xl overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
            <span className="relative flex items-center text-lg">
              Get Started
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </p>
          
          <p className="group relative px-12 py-5 bg-white/90 backdrop-blur-xl text-teal-600 border-2 border-teal-200 font-bold rounded-full shadow-xl transform transition-all duration-500 hover:scale-105 hover:bg-white hover:border-teal-300 hover:shadow-2xl overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative text-lg">Learn More</span>
          </p>
        </div>

        {/* Enhanced Interactive Process Cards with scroll effects */}
        <div 
          className="relative w-full max-w-7xl mx-auto mt-20 animate-fade-in-up animation-delay-1200"
          style={{
            transform: `translateY(${scrollY * 0.04}px) scale(${1 + Math.sin(scrollY * 0.003) * 0.02})`
          }}
        >
          <div className="absolute -inset-12 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 rounded-3xl blur-3xl opacity-40 animate-pulse"></div>
          
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/50 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl">
            <h3 className="text-4xl font-bold text-slate-800 mb-12 text-center flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-4 animate-pulse"></div>
              Simple Steps to Success
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <ProcessCard
                step="1"
                title="Discover"
                description="Explore our comprehensive platform and discover features designed for your needs"
                icon={
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                color="from-teal-500 via-teal-600 to-cyan-600"
                delay="0"
                scrollY={scrollY}
              />
              <ProcessCard
                step="2"
                title="Connect"
                description="Join our community and connect with like-minded individuals sharing similar goals"
                icon={
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                color="from-cyan-500 via-cyan-600 to-blue-600"
                delay="200"
                scrollY={scrollY}
              />
              <ProcessCard
                step="3"
                title="Achieve"
                description="Reach your goals with our comprehensive tools and continuous support system"
                icon={
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Enhanced Stats Section with scroll effects */}
      <StatsSection scrollY={scrollY} />

      {/* Features Section */}
      <Features scrollY={scrollY} />

      {/* Testimonials Section */}
      <Testimonials scrollY={scrollY} />

      {/* CTA Section */}
      <CTASection scrollY={scrollY} />
    </div>
  );
}

function ProcessCard({ step, title, description, icon, color, delay, scrollY }) {
  return (
    <div 
      className="group relative overflow-hidden animate-fade-in-up"
      style={{ 
        animationDelay: `${delay}ms`,
        transform: `translateY(${Math.sin((scrollY + parseInt(delay)) * 0.003) * 10}px)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl transform transition-all duration-700 group-hover:scale-105"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-100 group-hover:border-teal-200 transition-all duration-500 group-hover:shadow-2xl transform group-hover:-translate-y-2">
        <div className="flex items-center justify-between mb-8">
          <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
            {step}
          </div>
          <div className="text-teal-500 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-teal-700 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
          {description}
        </p>
        
        <div className={`absolute bottom-0 left-0 h-2 w-0 bg-gradient-to-r ${color} rounded-full group-hover:w-full transition-all duration-700`}></div>
      </div>
    </div>
  );
}

function StatsSection({ scrollY }) {
  const stats = [
    { 
      number: '10,000+', 
      label: 'Active Users', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      number: '99.9%', 
      label: 'Uptime', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      number: '4.9/5', 
      label: 'User Rating', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      number: '24/7', 
      label: 'Support', 
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <section 
      className="py-24 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.05}px)`
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div 
            className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-blob"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.01) * 30}px, ${Math.cos(scrollY * 0.01) * 20}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"
            style={{
              transform: `translate(${Math.cos(scrollY * 0.008) * 40}px, ${Math.sin(scrollY * 0.008) * 25}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full blur-2xl animate-blob animation-delay-4000"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.012) * 50}px, ${Math.cos(scrollY * 0.012) * 30}px)`
            }}
          ></div>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 
            className="text-5xl md:text-6xl font-black mb-6 animate-fade-in-up"
            style={{
              transform: `translateY(${scrollY * 0.08}px)`
            }}
          >
            <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Trusted Platform
            </span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-teal-100 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300"
            style={{
              transform: `translateY(${scrollY * 0.06}px)`
            }}
          >
            Join thousands of users who trust our platform for their needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 text-center transform transition-all duration-700 hover:scale-110 hover:bg-white/20 border border-white/30 hover:border-white/50 shadow-2xl animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.005) * 15}px) ${scrollY > 0 ? 'scale(1.05)' : 'scale(1)'}`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative text-white mb-8 flex justify-center group-hover:scale-125 group-hover:rotate-6 transition-all duration-500">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                  {stat.icon}
                </div>
              </div>
              
              <div className="relative text-4xl md:text-5xl font-black mb-4 group-hover:text-teal-100 transition-colors duration-300 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                {stat.number}
              </div>
              
              <div className="relative text-sm text-teal-100 font-semibold opacity-90 group-hover:opacity-100 transition-opacity duration-300">
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

function Features({ scrollY }) {
  const features = [
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Experience blazing fast performance with our optimized platform designed for modern users.",
      color: "from-teal-500 via-teal-600 to-cyan-600"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls.",
      color: "from-cyan-500 via-cyan-600 to-blue-600"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: "Responsive Design",
      description: "Perfect experience across all devices with our mobile-first responsive design.",
      color: "from-blue-500 via-blue-600 to-teal-600"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: "24/7 Support",
      description: "Get help when you need it with our round-the-clock customer support team.",
      color: "from-teal-500 via-cyan-500 to-blue-500"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Analytics & Insights",
      description: "Make data-driven decisions with comprehensive analytics and insights.",
      color: "from-cyan-500 via-blue-500 to-teal-500"
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      title: "Customizable",
      description: "Tailor the platform to your needs with extensive customization options.",
      color: "from-blue-500 via-teal-500 to-cyan-500"
    }
  ];

  return (
    <section 
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50 relative overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.03}px)`
      }}
    >
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-3xl animate-blob"
          style={{
            transform: `translate(${Math.sin(scrollY * 0.006) * 40}px, ${Math.cos(scrollY * 0.006) * 30}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl animate-blob animation-delay-2000"
          style={{
            transform: `translate(${Math.cos(scrollY * 0.008) * 50}px, ${Math.sin(scrollY * 0.008) * 20}px)`
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 
            className="text-5xl md:text-6xl font-black text-slate-800 mb-8 animate-fade-in-up"
            style={{
              transform: `translateY(${scrollY * 0.06}px)`
            }}
          >
            <span className="bg-gradient-to-r from-slate-800 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300"
            style={{
              transform: `translateY(${scrollY * 0.04}px)`
            }}
          >
            Discover the comprehensive suite of features designed to enhance your experience and boost productivity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-white/50 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 150}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.004) * 8}px)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-45 translate-x-8 -translate-y-8">
                <div className={`w-full h-full bg-gradient-to-r ${feature.color} rounded-2xl group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-teal-500 mb-8 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 flex">
                  <div className="p-4 bg-teal-50 rounded-2xl group-hover:bg-teal-100 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-6 group-hover:text-teal-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
                
                <div className={`absolute bottom-0 left-0 h-2 w-0 bg-gradient-to-r ${feature.color} rounded-full group-hover:w-full transition-all duration-700`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ scrollY }) {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Product Manager",
      content: "This platform has transformed how we work. The intuitive design and powerful features make it a joy to use every day.",
      avatar: (
        <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
          AJ
        </div>
      ),
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      content: "The attention to detail is incredible. Everything feels polished and the user experience is simply outstanding.",
      avatar: (
        <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
          SC
        </div>
      ),
      rating: 5
    },
    {
      name: "Michael Smith",
      role: "Developer",
      content: "Fast, reliable, and feature-rich. This platform has everything we need to build amazing products efficiently.",
      avatar: (
        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
          MS
        </div>
      ),
      rating: 5
    }
  ];

  return (
    <section 
      className="py-24 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.02}px)`
      }}
    >
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full blur-3xl animate-blob"
          style={{
            transform: `translate(${Math.sin(scrollY * 0.005) * 60}px, ${Math.cos(scrollY * 0.005) * 40}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full blur-3xl animate-blob animation-delay-4000"
          style={{
            transform: `translate(${Math.cos(scrollY * 0.007) * 45}px, ${Math.sin(scrollY * 0.007) * 35}px)`
          }}
        ></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 
            className="text-5xl md:text-6xl font-black text-slate-800 mb-8 animate-fade-in-up"
            style={{
              transform: `translateY(${scrollY * 0.04}px)`
            }}
          >
            <span className="bg-gradient-to-r from-slate-800 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              What Our Users Say
            </span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300"
            style={{
              transform: `translateY(${scrollY * 0.06}px)`
            }}
          >
            Join thousands of satisfied users who have transformed their workflow with our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-white/50 transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 150) * 0.003) * 12}px)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="transform transition-all duration-300 group-hover:scale-110">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-6">
                    <div className="font-bold text-slate-800 text-xl group-hover:text-teal-700 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">{testimonial.role}</div>
                  </div>
                </div>
                
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current transform transition-all duration-300 group-hover:scale-110" viewBox="0 0 20 20" style={{ animationDelay: `${i * 100}ms` }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-600 italic leading-relaxed text-lg mb-6 group-hover:text-slate-700 transition-colors duration-300">
                  "{testimonial.content}"
                </p>
                
                <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full group-hover:w-24 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className="text-center mt-16 animate-fade-in-up animation-delay-800"
          style={{
            transform: `translateY(${scrollY * 0.03}px)`
          }}
        >
          <div className="inline-flex items-center bg-white/80 backdrop-blur-xl rounded-full px-10 py-6 border border-white/50 shadow-xl transform transition-all duration-500 hover:scale-105 hover:bg-white">
            <div className="flex -space-x-3 mr-6">
              {[
                'from-teal-400 to-cyan-400',
                'from-cyan-400 to-blue-400',
                'from-blue-400 to-teal-400',
                'from-teal-500 to-cyan-500',
                'from-cyan-500 to-blue-500'
              ].map((gradient, index) => (
                <div 
                  key={index}
                  className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-full border-3 border-white shadow-lg transform transition-all duration-300 hover:scale-110 animate-float`}
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    transform: `scale(${1 + Math.sin((scrollY + index * 100) * 0.008) * 0.1})`
                  }}
                />
              ))}
              <div className="w-12 h-12 bg-slate-100 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-slate-600">+10K</span>
              </div>
            </div>
            <span className="text-slate-700 font-bold text-lg">
              Join our growing community
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ scrollY }) {
  return (
    <section 
      className="py-24 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.01}px)`
      }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-15">
          <div 
            className="absolute top-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-blob"
            style={{
              transform: `translate(${Math.sin(scrollY * 0.004) * 50}px, ${Math.cos(scrollY * 0.004) * 30}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"
            style={{
              transform: `translate(${Math.cos(scrollY * 0.006) * 60}px, ${Math.sin(scrollY * 0.006) * 40}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-2xl animate-blob animation-delay-4000"
            style={{
              transform: `translate(-50%, -50%) translate(${Math.sin(scrollY * 0.008) * 70}px, ${Math.cos(scrollY * 0.008) * 35}px)`
            }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700/30 to-blue-700/30"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
        <div className="mb-16">
          <h2 
            className="text-5xl md:text-7xl font-black mb-8 leading-tight animate-fade-in-up"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`
            }}
          >
            <span className="bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          <p 
            className="text-xl md:text-2xl text-teal-100 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`
            }}
          >
            Join thousands of users who have discovered a better way to work. 
            Start your journey today and experience the difference.
          </p>
        </div>
        
        <div 
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16 animate-fade-in-up animation-delay-600"
          style={{
            transform: `translateY(${scrollY * 0.02}px)`
          }}
        >
          <p className="group relative px-16 py-6 text-xl font-bold text-teal-600 bg-white rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-3xl overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-teal-100 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"></div>
            <span className="relative flex items-center">
              Get Started Now
              <svg className="ml-4 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </p>
          
          <p className="group relative px-16 py-6 text-xl font-bold text-white border-2 border-white/40 rounded-full transform transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/70 backdrop-blur-xl overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-teal-100/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <span className="relative">Learn More</span>
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto animate-fade-in-up animation-delay-900"
          style={{
            transform: `translateY(${scrollY * 0.04}px)`
          }}
        >
          {[
            { icon: "M5 13l4 4L19 7", text: "No setup fees" },
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Secure & Private" },
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant Access" }
          ].map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center animate-fade-in-up" 
              style={{ 
                animationDelay: `${900 + index * 200}ms`,
                transform: `translateY(${Math.sin((scrollY + index * 100) * 0.006) * 10}px)`
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 mx-auto transform transition-all duration-500 hover:scale-110 hover:bg-white/30 border border-white/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <p className="text-teal-100 font-bold text-lg">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStats({ scrollY }) {
  return (
    <div 
      className="mt-20 relative animate-fade-in-up animation-delay-1000"
      style={{
        transform: `translateY(${scrollY * 0.08}px) scale(${1 + Math.sin(scrollY * 0.005) * 0.02})`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-3xl blur-3xl opacity-10 animate-pulse"></div>
      
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
        <h3 className="text-3xl font-bold text-slate-800 mb-10 text-center flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-3 animate-pulse"></div>
          Your Activity
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <StatCard 
            number="0" 
            label="Projects Created" 
            color="teal"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            scrollY={scrollY}
          />
          <StatCard 
            number="0" 
            label="Tasks Completed" 
            color="cyan"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            scrollY={scrollY}
          />
          <StatCard 
            number="0" 
            label="Connections Made" 
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

function StatCard({ number, label, color, icon, scrollY }) {
  const colorClasses = {
    teal: 'text-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 shadow-teal-100',
    cyan: 'text-cyan-600 bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 shadow-cyan-100',
    blue: 'text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-blue-100'
  };

  return (
    <div 
      className={`group p-8 rounded-2xl ${colorClasses[color]} border shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1`}
      style={{
        transform: `translateY(${Math.sin((scrollY + (color === 'teal' ? 0 : color === 'cyan' ? 100 : 200)) * 0.008) * 5}px)`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="text-4xl font-black group-hover:scale-110 transition-transform duration-300">{number}</div>
          <div className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{icon}</div>
        </div>
        <div className="text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity duration-300">{label}</div>
      </div>
    </div>
  );
}

// Enhanced CSS animations with scroll effects
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-8px) rotate(1deg); }
    50% { transform: translateY(-4px) rotate(0deg); }
    75% { transform: translateY(-6px) rotate(-1deg); }
  }
  
  @keyframes blob {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes fade-in-up {
    from { 
      opacity: 0; 
      transform: translateY(40px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0px) scale(1); 
    }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-blob {
    animation: blob 7s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 300% 300%;
    animation: gradient 8s ease infinite;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 1s ease-out forwards;
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
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
  
  /* Scroll-based transformations */
  .scroll-transform {
    will-change: transform;
  }
  
  /* Enhanced parallax effects */
  .parallax-slow {
    transform: translateY(calc(var(--scroll) * 0.5px));
  }
  
  .parallax-fast {
    transform: translateY(calc(var(--scroll) * -0.8px));
  }
  
  /* Smooth transitions for scroll effects */
  .smooth-transform {
    transition: transform 0.1s ease-out;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-blob,
    .animate-gradient,
    .animate-fade-in-up,
    .scroll-transform,
    .parallax-slow,
    .parallax-fast {
      animation: none;
      transform: none !important;
    }
    
    .animate-fade-in-up {
      opacity: 1;
    }
  }
  
  /* Enhanced hover effects */
  .group:hover .group-hover\\:scale-125 {
    transform: scale(1.25);
  }
  
  .group:hover .group-hover\\:rotate-6 {
    transform: rotate(6deg);
  }
  
  .group:hover .group-hover\\:rotate-12 {
    transform: rotate(12deg);
  }
  
  /* Glass morphism effects */
  .backdrop-blur-xl {
    backdrop-filter: blur(24px);
  }
  
  .backdrop-blur-2xl {
    backdrop-filter: blur(40px);
  }
  
  /* Performance optimizations */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .transform-gpu {
    transform: translateZ(0);
    will-change: transform;
  }
`;

// Inject enhanced styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  if (!document.head.querySelector('[data-enhanced-scroll-styles]')) {
    styleSheet.setAttribute('data-enhanced-scroll-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}