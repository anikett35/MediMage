import React from "react";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              About <span className="text-teal-600">MediMage</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing healthcare access through intelligent technology and compassionate care. 
              We're building the future of medical appointments, one patient at a time.
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-teal-100"
            initial="hidden"
            animate="visible"
            variants={scaleIn}
          >
            <div className="text-center mb-8">
              <motion.div 
                className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
            </div>
            <p className="text-lg text-slate-600 text-center max-w-4xl mx-auto leading-relaxed">
              MediMage is designed to make healthcare accessible, efficient, and patient-centered. 
              We bridge the gap between patients and healthcare providers through innovative technology, 
              ensuring quality medical care is just a click away. Our platform empowers both patients 
              and healthcare professionals to focus on what matters most - your health and well-being.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="mb-16">
            <motion.h2 
              className="text-3xl font-bold text-slate-800 text-center mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              Why Choose MediMage?
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Feature 1 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-1 4h6m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4m4 0H8m5-5v.01M12 12v.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Easy Online Booking</h3>
                <p className="text-slate-600">
                  Book appointments with doctors across all specialties in just a few clicks. 
                  Our intuitive interface makes scheduling healthcare visits effortless.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Secure & Private</h3>
                <p className="text-slate-600">
                  Your personal health information is protected with enterprise-grade security. 
                  We ensure complete privacy and confidentiality of your medical data.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Dashboard</h3>
                <p className="text-slate-600">
                  Manage all your appointments, medical records, and healthcare providers 
                  from one centralized, user-friendly dashboard.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Multi-Device Access</h3>
                <p className="text-slate-600">
                  Access your healthcare dashboard from any device - desktop, tablet, or mobile. 
                  Your health management is always within reach.
                </p>
              </motion.div>

              {/* Feature 5 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Healthcare Network</h3>
                <p className="text-slate-600">
                  Connect with qualified healthcare professionals across all specialties. 
                  Our network includes verified doctors with proven track records.
                </p>
              </motion.div>

              {/* Feature 6 */}
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-teal-100"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Notifications</h3>
                <p className="text-slate-600">
                  Receive timely reminders about upcoming appointments, health checkups, 
                  and important medical notifications to stay on top of your health.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Statistics Section */}
          <motion.div 
            className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 mb-16 text-white"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Trusted Worldwide</h2>
              <p className="text-teal-100 text-lg">Join thousands who trust MediMage with their healthcare needs</p>
            </div>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-teal-100">Qualified Doctors</div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-teal-100">Happy Patients</div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-teal-100">Medical Specialties</div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-teal-100">Uptime Guarantee</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Vision Section */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-teal-100"
            initial="hidden"
            animate="visible"
            variants={scaleIn}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Vision for Healthcare</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  We envision a world where quality healthcare is accessible to everyone, regardless of location or circumstances. 
                  Through MediMage, we're creating a connected healthcare ecosystem that puts patients first.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our platform leverages cutting-edge technology to eliminate barriers between patients and healthcare providers, 
                  making medical care more efficient, affordable, and personalized.
                </p>
              </div>
              <motion.div 
                className="text-center"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="inline-flex items-center justify-center w-48 h-48 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full">
                  <svg className="w-24 h-24 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3m0 0a9 9 0 109 0m-9 0a9 9 0 019 0" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Values */}
          <div className="mb-16">
            <motion.h2 
              className="text-3xl font-bold text-slate-800 text-center mb-12"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              Our Core Values
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="text-center"
                variants={fadeInUp}
              >
                <motion.div 
                  className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Compassion</h3>
                <p className="text-slate-600">
                  We approach healthcare with empathy and understanding, 
                  treating every patient with dignity and respect.
                </p>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={fadeInUp}
              >
                <motion.div 
                  className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Excellence</h3>
                <p className="text-slate-600">
                  We maintain the highest standards in healthcare technology 
                  and service delivery for optimal patient outcomes.
                </p>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={fadeInUp}
              >
                <motion.div 
                  className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Innovation</h3>
                <p className="text-slate-600">
                  We continuously evolve our platform with cutting-edge technology 
                  to improve healthcare accessibility and efficiency.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div 
            className="text-center bg-white rounded-2xl shadow-xl p-12 border border-teal-100"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join MediMage today and discover how easy managing your health can be. 
              Your journey to better healthcare starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
              </motion.button>
              <motion.button 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-8 rounded-xl font-semibold transition-all duration-200 border border-slate-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}