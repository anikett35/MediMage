import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold">MediMage</span>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Revolutionizing healthcare access through intelligent technology
              and compassionate care. Your health is our priority.
            </p>
            </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-teal-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/home"
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/DoctorList"
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-teal-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-teal-400">
              Our Services
            </h3>
            <ul className="space-y-3">
              <li>
                <p className="text-slate-300">Online Consultations</p>
              </li>
              <li>
                <p className="text-slate-300">Appointment Booking</p>
              </li>
              <li>
                <p className="text-slate-300">Medical Records</p>
              </li>
              <li>
                <p className="text-slate-300">Health Tracking</p>
              </li>
              <li>
                <p className="text-slate-300">Emergency Care</p>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-teal-400">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                
                <span className="text-slate-300">
                  123 Healthcare Ave, Medical District, City 10001
                </span>
              </li>
              <li className="flex items-start">
               
                <span className="text-slate-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                
                <span className="text-slate-300">support@medimage.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-slate-700 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-teal-400">
                Stay Updated
              </h3>
              <p className="text-slate-300">
                Subscribe to our newsletter for health tips and updates
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 bg-slate-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64"
              />
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MediMage. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-slate-400 hover:text-teal-400 text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Contact Strip */}
      <div className="bg-teal-600 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <svg
                className="w-5 h-5 text-white mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938..."
                />
              </svg>
              <span className="text-white font-medium">
                Emergency Hotline: 911
              </span>
            </div>
            <div className="text-white text-sm">
              24/7 Support Available • Always Here to Help
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
