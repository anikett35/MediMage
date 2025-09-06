import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";

export default function MediMageHome() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading MediMage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header isSignedIn={isSignedIn} user={user} />
      
      {isSignedIn ? (
        <DashboardView user={user} />
      ) : (
        <LandingView />
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

function Header({ isSignedIn, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">MediMage</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Find Doctors</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Specialties</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Welcome, {user.firstName}</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <button className="text-gray-700 hover:text-blue-600 font-medium">Sign In</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Find Doctors</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Specialties</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              {!isSignedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <button className="text-left text-gray-700 hover:text-blue-600 font-medium">Sign In</button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-left">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function DashboardView({ user }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 md:p-8 text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
        <p className="text-blue-100">Manage your appointments and health records</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickActionCard
          title="Book Appointment"
          description="Schedule with a doctor"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="blue"
        />
        <QuickActionCard
          title="My Appointments"
          description="View upcoming visits"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="green"
        />
        <QuickActionCard
          title="Medical Records"
          description="Access your history"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="purple"
        />
        <QuickActionCard
          title="Messages"
          description="Doctor communications"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          color="indigo"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem
            title="Appointment with Dr. Sarah Johnson"
            date="March 15, 2024"
            type="Completed"
            status="completed"
          />
          <ActivityItem
            title="Lab Results Available"
            date="March 12, 2024"
            type="Lab Report"
            status="new"
          />
          <ActivityItem
            title="Upcoming: Dr. Michael Chen"
            date="March 20, 2024"
            type="Scheduled"
            status="upcoming"
          />
        </div>
      </div>
    </div>
  );
}

function LandingView() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Your Health, <span className="text-blue-600">Simplified</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Book appointments with top doctors, manage your medical records, and take control of your healthcare journey with MediMage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Book Appointment
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-white/30 rounded-lg mb-2"></div>
                    <div className="h-4 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-white/30 rounded-lg mb-2"></div>
                    <div className="h-4 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-white/30 rounded-lg mb-2"></div>
                    <div className="h-4 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="w-8 h-8 bg-white/30 rounded-lg mb-2"></div>
                    <div className="h-4 bg-white/30 rounded mb-1"></div>
                    <div className="h-3 bg-white/20 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MediMage?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience healthcare management like never before with our comprehensive platform designed for patients and healthcare providers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Easy Booking"
              description="Schedule appointments with your preferred doctors in just a few clicks. View availability in real-time."
            />
            <FeatureCard
              icon={
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Digital Records"
              description="Access your complete medical history, lab results, and prescriptions anytime, anywhere securely."
            />
            <FeatureCard
              icon={
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Expert Doctors"
              description="Connect with certified healthcare professionals across various specialties and locations."
            />
            <FeatureCard
              icon={
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              title="Mobile Ready"
              description="Access all features on-the-go with our responsive design that works perfectly on any device."
            />
            <FeatureCard
              icon={
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.006 19l.01-11.01a2 2 0 011.99-1.99h8l4 4v7a2 2 0 01-2 2h-8.01a2 2 0 01-1.99-1.99z" />
                </svg>
              }
              title="Smart Reminders"
              description="Never miss an appointment with automated reminders via SMS, email, and push notifications."
            />
            <FeatureCard
              icon={
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Secure & Private"
              description="Your health data is protected with enterprise-grade security and HIPAA compliance."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="50,000+" label="Happy Patients" />
            <StatCard number="1,200+" label="Expert Doctors" />
            <StatCard number="25+" label="Specialties" />
            <StatCard number="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Medical Specialties
            </h2>
            <p className="text-lg text-gray-600">
              Find the right specialist for your healthcare needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <SpecialtyCard title="Cardiology" icon="❤️" />
            <SpecialtyCard title="Dermatology" icon="🧴" />
            <SpecialtyCard title="Neurology" icon="🧠" />
            <SpecialtyCard title="Orthopedics" icon="🦴" />
            <SpecialtyCard title="Pediatrics" icon="👶" />
            <SpecialtyCard title="Psychiatry" icon="💭" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients who trust MediMage for their healthcare management.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Get Started Today
          </button>
        </div>
      </section>
    </>
  );
}

function QuickActionCard({ title, description, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
  };

  return (
    <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ActivityItem({ title, date, type, status }) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    new: 'bg-blue-100 text-blue-800',
    upcoming: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {type}
      </span>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center p-6">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function SpecialtyCard({ title, icon }) {
  return (
    <div className="bg-white rounded-xl border p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-gray-900">{title}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold">MediMage</span>
            </div>
            <p className="text-gray-400 text-sm">
              Simplifying healthcare management for patients and providers worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Patients</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Book Appointment</a></li>
              <li><a href="#" className="hover:text-white">Find Doctors</a></li>
              <li><a href="#" className="hover:text-white">Medical Records</a></li>
              <li><a href="#" className="hover:text-white">Health Tips</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Doctors</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Join Network</a></li>
              <li><a href="#" className="hover:text-white">Practice Management</a></li>
              <li><a href="#" className="hover:text-white">Patient Portal</a></li>
              <li><a href="#" className="hover:text-white">Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 MediMage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
