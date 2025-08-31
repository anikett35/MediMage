import React, { useState, useEffect, useRef } from 'react';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  
  // Booking form state - same structure as your contact form
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    appointmentDate: '',
    appointmentTime: '',
    paymentMethod: 'card',
    notes: ''
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Form submission states - same as your contact form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const { isSignedIn, user } = useUser();
  const audioRef = useRef(null);

  // Sample doctor data
  useEffect(() => {
    const sampleDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        experience: '12 years',
        rating: 4.8,
        totalRatings: 124,
        price: 1500,
        availability: ['10:00 AM', '2:00 PM', '4:30 PM'],
        location: 'New Delhi, India',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        qualifications: 'MBBS, MD Cardiology',
        languages: 'English, Hindi'
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Neurologist',
        experience: '15 years',
        rating: 4.9,
        totalRatings: 98,
        price: 2000,
        availability: ['9:00 AM', '11:30 AM', '3:00 PM'],
        location: 'Mumbai, India',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        qualifications: 'MBBS, MD Neurology',
        languages: 'English, Mandarin'
      },
      {
        id: 3,
        name: 'Dr. Emily Williams',
        specialty: 'Pediatrician',
        experience: '8 years',
        rating: 4.7,
        totalRatings: 87,
        price: 1200,
        availability: ['10:30 AM', '1:00 PM', '5:00 PM'],
        location: 'Bangalore, India',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        qualifications: 'MBBS, MD Pediatrics',
        languages: 'English, Spanish'
      }
    ];
    setDoctors(sampleDoctors);
  }, []);

  // Auto-fill user data when signed in - similar to your contact form
  useEffect(() => {
    if (isSignedIn && user) {
      setAppointmentData(prev => ({
        ...prev,
        patientName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        patientEmail: user.emailAddresses[0]?.emailAddress || ''
      }));
    }
  }, [isSignedIn, user]);

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Handle input changes - same pattern as your contact form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const playSuccessSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log("Audio play failed:", error);
      });
    }
  };

  const handleBookAppointment = (doctor) => {
    if (!isSignedIn) {
      setSelectedDoctor(doctor);
      setShowSignInPrompt(true);
      return;
    }
    
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    setPaymentSuccess(false);
    setSubmitStatus(null);
    setErrorMessage('');
    
    // Set tomorrow as default date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentData(prev => ({
      ...prev,
      appointmentDate: tomorrow.toISOString().split('T')[0]
    }));
  };

  // Main appointment booking function - same structure as your contact form submit
  const handleAppointmentBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    // Validate required fields
    if (!appointmentData.patientName || !appointmentData.patientEmail || 
        !appointmentData.appointmentDate || !appointmentData.appointmentTime) {
      setSubmitStatus('error');
      setErrorMessage('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for backend - same structure as your contact form
      const bookingData = {
        patientName: appointmentData.patientName,
        patientEmail: appointmentData.patientEmail,
        patientPhone: appointmentData.patientPhone,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
        consultationFee: selectedDoctor.price,
        paymentMethod: appointmentData.paymentMethod,
        notes: appointmentData.notes
      };

      // Submit to backend - same pattern as your contact form
      const response = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setPaymentSuccess(true);
        playSuccessSound();
        
        // Reset form data
        setAppointmentData({
          patientName: user?.fullName || '',
          patientEmail: user?.emailAddresses[0]?.emailAddress || '',
          patientPhone: '',
          appointmentDate: '',
          appointmentTime: '',
          paymentMethod: 'card',
          notes: ''
        });
        
        // Auto-close modal after success
        setTimeout(() => {
          setShowBookingModal(false);
          setPaymentSuccess(false);
          setSubmitStatus(null);
        }, 3000);
        
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to book appointment");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReview = () => {
    alert(`Thank you for your ${rating} star review!`);
    setRating(0);
    setReview('');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <audio ref={audioRef} src="/Payment.mp3" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 pt-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Find Your Healthcare Professional</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Connect with qualified medical specialists and book appointments with ease
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-teal-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search Doctors</label>
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-teal-100">
              <div className="p-6">
                {/* Doctor Header */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-16 w-16 rounded-full object-cover ring-4 ring-teal-100"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-slate-800">{doctor.name}</h3>
                    <p className="text-teal-600 font-semibold">{doctor.specialty}</p>
                    <p className="text-sm text-slate-500">{doctor.qualifications}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderStars(doctor.rating)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{doctor.rating}</span>
                  <span className="text-sm text-slate-500 ml-1">({doctor.totalRatings} reviews)</span>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{doctor.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{doctor.experience} experience</span>
                  </div>

                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>{doctor.languages}</span>
                  </div>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-teal-600">
                    ₹{doctor.price}
                    <span className="text-sm font-normal text-slate-500">/consultation</span>
                  </div>
                  <button
                    onClick={() => handleBookAppointment(doctor)}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sign In Prompt Modal */}
        {showSignInPrompt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-teal-100">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign In Required</h2>
                <p className="text-slate-600">
                  Please sign in to book an appointment with {selectedDoctor?.name}
                </p>
              </div>
              
              <div className="space-y-3">
                <SignInButton mode="modal">
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors duration-200">
                    Create Account
                  </button>
                </SignUpButton>
                
                <button
                  onClick={() => setShowSignInPrompt(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal - Updated with backend integration */}
        {showBookingModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto border border-teal-100">
              {!paymentSuccess ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Book Appointment</h2>
                    
                    <div className="flex items-center justify-center mb-6">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="h-16 w-16 rounded-full object-cover ring-4 ring-teal-100 mr-4"
                      />
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-slate-800">{selectedDoctor.name}</h3>
                        <p className="text-teal-600 font-semibold">{selectedDoctor.specialty}</p>
                        <p className="text-sm text-slate-500">{selectedDoctor.location}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleAppointmentBooking} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Patient Name *
                        </label>
                        <input
                          type="text"
                          name="patientName"
                          value={appointmentData.patientName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="patientEmail"
                          value={appointmentData.patientEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="patientPhone"
                        value={appointmentData.patientPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-1 4h6m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4m4 0H8m5-5v.01M12 12v.01" />
                          </svg>
                          Select Date *
                        </label>
                        <input
                          type="date"
                          name="appointmentDate"
                          value={appointmentData.appointmentDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Select Time *
                        </label>
                        <select
                          name="appointmentTime"
                          value={appointmentData.appointmentTime}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="">Choose available time</option>
                          {selectedDoctor.availability.map((time, index) => (
                            <option key={index} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => setAppointmentData(prev => ({ ...prev, paymentMethod: 'card' }))}
                          className={`p-3 rounded-xl border-2 font-medium transition-all ${
                            appointmentData.paymentMethod === 'card' 
                              ? 'border-teal-500 bg-teal-50 text-teal-700' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          Credit/Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppointmentData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                          className={`p-3 rounded-xl border-2 font-medium transition-all ${
                            appointmentData.paymentMethod === 'upi' 
                              ? 'border-teal-500 bg-teal-50 text-teal-700' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          UPI Payment
                        </button>
                      </div>

                      {appointmentData.paymentMethod === 'card' && (
                        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              name="number"
                              value={formatCardNumber(cardDetails.number)}
                              onChange={handleCardInputChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                            <input
                              type="text"
                              name="name"
                              value={cardDetails.name}
                              onChange={handleCardInputChange}
                              placeholder="John Doe"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                name="expiry"
                                value={formatExpiry(cardDetails.expiry)}
                                onChange={handleCardInputChange}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                              <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardInputChange}
                                placeholder="123"
                                maxLength={3}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {appointmentData.paymentMethod === 'upi' && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                          <input
                            type="text"
                            placeholder="yourname@upi"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                          <p className="text-xs text-slate-500 mt-2">You will be redirected to your UPI app for payment</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={appointmentData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Any specific concerns or requirements for your appointment..."
                      />
                    </div>

                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-slate-800">Total Amount:</span>
                        <span className="text-2xl font-bold text-teal-600">₹{selectedDoctor.price}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBookingModal(false);
                          setIsSubmitting(false);
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-semibold transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Booking Appointment...
                          </div>
                        ) : 'Book Appointment & Pay'}
                      </button>
                    </div>

                    {/* Status Messages - Same as your contact form */}
                    {submitStatus === "success" && (
                      <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <div>
                          <p className="font-semibold">Appointment booked successfully!</p>
                          <p className="text-sm">Confirmation details sent to your email.</p>
                        </div>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="font-semibold">Failed to book appointment</p>
                          <p className="text-sm">{errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">Appointment Booked!</h3>
                  <p className="text-slate-600 mb-4">Your appointment with {selectedDoctor.name} has been confirmed.</p>
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 max-w-sm mx-auto">
                    <p className="text-teal-800 font-semibold">Appointment Details:</p>
                    <p className="text-teal-700">Date: {appointmentData.appointmentDate}</p>
                    <p className="text-teal-700">Time: {appointmentData.appointmentTime}</p>
                    <p className="text-teal-700">Fee: ₹{selectedDoctor.price}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rating Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Rate Your Experience</h2>
            <p className="text-slate-600">Help others by sharing your experience with our healthcare professionals</p>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Doctor</label>
              <select className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option value="">Choose a doctor to review</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Your Rating</label>
              <div className="flex justify-center">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    className="text-3xl focus:outline-none mx-1 transition-transform hover:scale-110"
                    onClick={() => setRating(index + 1)}
                    onMouseEnter={() => setHover(index + 1)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <svg
                      className={`w-8 h-8 ${index + 1 <= (hover || rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-slate-500 mt-2">Click to rate</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Your Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="4"
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Share your experience with this healthcare professional..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                onClick={submitReview}
                disabled={rating === 0}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-teal-100">Your health is our priority</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-teal-100">Qualified Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-teal-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-teal-100">Medical Specialties</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;