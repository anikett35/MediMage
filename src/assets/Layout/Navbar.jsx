import React, { useState, useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Handle admin navigation with authentication check
  const handleAdminClick = (e) => {
    if (!isSignedIn) {
      e.preventDefault();
      // You can either redirect to sign in or show a message
      navigate('/sign-in?redirect_url=/admin');
    }
    // If signed in, the link will work normally
  };

  const navigationItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    
    { 
      name: 'Doctors', 
      path: '/DoctorList', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      name: 'About', 
      path: '/about', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Admin', 
      path: '/admin', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      requiresAuth: true
    },
    
    { 
      name: 'Contact', 
      path: '/contact', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || isSignedIn
  );

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/98 backdrop-blur-md shadow-xl border-b border-teal-100' 
        : 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-3 text-2xl font-bold transition-colors ${
              scrolled ? 'text-teal-700 hover:text-teal-800' : 'text-white hover:text-teal-100'
            }`}
          >
            <div className={`p-2 rounded-xl ${scrolled ? 'bg-teal-100' : 'bg-white/20'}`}>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span className="tracking-tight">MediMage</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            {filteredNavItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                isActive={isActivePath(item.path)}
                scrolled={scrolled}
                icon={item.icon}
                onClick={item.requiresAuth ? handleAdminClick : null}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 border ${
                  scrolled 
                    ? 'text-teal-700 border-teal-300 hover:bg-teal-50 hover:border-teal-400' 
                    : 'text-white border-white/30 hover:bg-white/10 hover:border-white/50'
                }`}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                  scrolled 
                    ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-xl' 
                    : 'bg-white text-teal-700 hover:bg-teal-50 hover:shadow-xl'
                }`}>
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-3">
                <NotificationBell scrolled={scrolled} />
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-teal-200 hover:ring-teal-300 transition-all"
                    }
                  }}
                  userProfileMode="modal"
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <SignedIn>
              <NotificationBell scrolled={scrolled} />
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-teal-200"
                  }
                }}
                userProfileMode="modal"
              />
            </SignedIn>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                scrolled 
                  ? 'text-teal-700 hover:bg-teal-50' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isOpen}
        navigationItems={filteredNavItems}
        currentPath={location.pathname}
        onClose={() => setIsOpen(false)}
        scrolled={scrolled}
        handleAdminClick={handleAdminClick}
      />
    </nav>
  );
}

function NavLink({ to, children, isActive, scrolled, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? scrolled
            ? 'bg-teal-50 text-teal-700 border border-teal-200'
            : 'bg-white/20 text-white border border-white/20'
          : scrolled
            ? 'text-slate-700 hover:text-teal-700 hover:bg-teal-50'
            : 'text-white/90 hover:text-white hover:bg-white/10'
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{children}</span>
    </Link>
  );
}

function NotificationBell({ scrolled }) {
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <button 
      className={`relative p-2.5 rounded-lg transition-all duration-200 ${
        scrolled 
          ? 'text-slate-600 hover:bg-teal-50 hover:text-teal-700' 
          : 'text-white hover:bg-white/10'
      }`}
      aria-label="Notifications"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {hasNotifications && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
      )}
    </button>
  );
}

function MobileMenu({ isOpen, navigationItems, currentPath, onClose, scrolled, handleAdminClick }) {
  return (
    <div className={`lg:hidden transition-all duration-300 ease-in-out ${
      isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
    }`}>
      <div className={`${
        scrolled 
          ? 'bg-white/98 backdrop-blur-sm border-t border-teal-100' 
          : 'bg-gradient-to-b from-cyan-600 to-blue-700'
      } px-4 pt-4 pb-6 space-y-2 shadow-lg`}>
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={item.requiresAuth ? handleAdminClick : onClose}
            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
              currentPath === item.path
                ? scrolled
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'bg-white/20 text-white border border-white/20'
                : scrolled
                  ? 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}

        {/* Mobile Auth Buttons */}
        <SignedOut>
          <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
            <SignInButton mode="modal">
              <button className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200 border ${
                scrolled 
                  ? 'text-teal-700 border-teal-300 hover:bg-teal-50' 
                  : 'bg-transparent text-white border-white/30 hover:bg-white/10'
              }`}>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg ${
                scrolled 
                  ? 'bg-teal-600 text-white hover:bg-teal-700' 
                  : 'bg-white text-teal-700 hover:bg-teal-50'
              }`}>
                Get Started
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}