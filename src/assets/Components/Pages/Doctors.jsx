import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Calendar,
  CreditCard,
  Shield,
  Users,
  Award,
  Heart,
  Stethoscope,
  Activity,
} from "lucide-react";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  // Booking form state
  const [appointmentData, setAppointmentData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    appointmentDate: "",
    appointmentTime: "",
    paymentMethod: "card",
    notes: "",
  });

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { isSignedIn, user } = useUser();
  const audioRef = useRef(null);
  const { scrollY } = useScroll();

  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 300], [0, 50]);

  // Sample doctor data
  useEffect(() => {
    const sampleDoctors = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        experience: "12 years",
        rating: 4.8,
        totalRatings: 124,
        price: 1500,
        availability: ["10:00 AM", "2:00 PM", "4:30 PM"],
        location: "New Delhi, India",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        qualifications: "MBBS, MD Cardiology",
        languages: "English, Hindi",
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Neurologist",
        experience: "15 years",
        rating: 4.9,
        totalRatings: 98,
        price: 2000,
        availability: ["9:00 AM", "11:30 AM", "3:00 PM"],
        location: "Mumbai, India",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        qualifications: "MBBS, MD Neurology",
        languages: "English, Mandarin",
      },
      {
        id: 3,
        name: "Dr. Emily Williams",
        specialty: "Pediatrician",
        experience: "8 years",
        rating: 4.7,
        totalRatings: 87,
        price: 1200,
        availability: ["10:30 AM", "1:00 PM", "5:00 PM"],
        location: "Bangalore, India",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        qualifications: "MBBS, MD Pediatrics",
        languages: "English, Spanish",
      },
    ];
    setDoctors(sampleDoctors);
  }, []);

  // Auto-fill user data when signed in
  useEffect(() => {
    if (isSignedIn && user) {
      setAppointmentData((prev) => ({
        ...prev,
        patientName:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        patientEmail: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [isSignedIn, user]);

  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const playSuccessSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
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
    setErrorMessage("");

    // Set tomorrow as default date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentData((prev) => ({
      ...prev,
      appointmentDate: tomorrow.toISOString().split("T")[0],
    }));
  };

  // Main appointment booking function
  const handleAppointmentBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    // Validate required fields
    if (
      !appointmentData.patientName ||
      !appointmentData.patientEmail ||
      !appointmentData.appointmentDate ||
      !appointmentData.appointmentTime
    ) {
      setSubmitStatus("error");
      setErrorMessage("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for backend
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
        notes: appointmentData.notes,
      };

      // Submit to backend
      const response = await fetch(
        "https://medimage-1.onrender.com/api/appointments/book",
",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setPaymentSuccess(true);
        playSuccessSound();

        // Reset form data
        setAppointmentData({
          patientName: user?.fullName || "",
          patientEmail: user?.emailAddresses[0]?.emailAddress || "",
          patientPhone: "",
          appointmentDate: "",
          appointmentTime: "",
          paymentMethod: "card",
          notes: "",
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
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReview = () => {
    alert(`Thank you for your ${rating} star review!`);
    setRating(0);
    setReview("");
  };

  // Render stars function
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }

    return value;
  };

  // Floating Background Elements Component
  const FloatingElements = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {" "}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-xl"
        animate={{
          y: [0, -25, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );

  // Animated Counter Component
  const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (isInView) {
        let startTime;
        const animate = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min(
            (currentTime - startTime) / (duration * 1000),
            1
          );

          setCount(Math.floor(progress * end));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      }
    }, [isInView, end, duration]);

    return (
      <motion.div
        ref={ref}
        className="text-4xl font-bold mb-2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {count}
        {suffix}
      </motion.div>
    );
  };

  // Doctor Card Component
  const DoctorCard = ({ doctor, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, rotateX: 10 }}
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{
          y: -8,
          rotateX: 5,
          rotateY: 5,
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
        className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-500"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="p-8 relative">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
          />

          {/* Doctor Header */}
          <div className="flex items-center mb-6 relative z-10">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-teal-100 group-hover:ring-teal-200 transition-all duration-300"
              />
              <motion.div
                className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="ml-4">
              <motion.h3
                className="text-xl font-bold text-slate-800 group-hover:text-teal-700 transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                {doctor.name}
              </motion.h3>
              <motion.p
                className="text-teal-600 font-semibold"
                whileHover={{ x: 5 }}
                transition={{ delay: 0.1 }}
              >
                {doctor.specialty}
              </motion.p>
              <motion.p
                className="text-sm text-slate-500"
                whileHover={{ x: 5 }}
                transition={{ delay: 0.2 }}
              >
                {doctor.qualifications}
              </motion.p>
            </div>
          </div>

          {/* Rating */}
          <motion.div
            className="flex items-center mb-4 relative z-10"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex mr-2">
              {renderStars(Math.floor(doctor.rating))}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {doctor.rating}
            </span>
            <span className="text-sm text-slate-500 ml-1">
              ({doctor.totalRatings} reviews)
            </span>
          </motion.div>

          {/* Details */}
          <div className="space-y-3 mb-6 relative z-10">
            <motion.div
              className="flex items-center text-sm text-slate-600"
              whileHover={{ x: 5 }}
            >
              <MapPin className="w-4 h-4 mr-3 text-slate-400" />
              <span>{doctor.location}</span>
            </motion.div>

            <motion.div
              className="flex items-center text-sm text-slate-600"
              whileHover={{ x: 5 }}
              transition={{ delay: 0.1 }}
            >
              <Clock className="w-4 h-4 mr-3 text-slate-400" />
              <span>{doctor.experience} experience</span>
            </motion.div>

            <motion.div
              className="flex items-center text-sm text-slate-600"
              whileHover={{ x: 5 }}
              transition={{ delay: 0.2 }}
            >
              <Users className="w-4 h-4 mr-3 text-slate-400" />
              <span>{doctor.languages}</span>
            </motion.div>
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between relative z-10">
            <motion.div
              className="text-2xl font-bold text-teal-600"
              whileHover={{ scale: 1.05 }}
            >
              ₹{doctor.price}
              <span className="text-sm font-normal text-slate-500">
                /consultation
              </span>
            </motion.div>
            <motion.button
              onClick={() => handleBookAppointment(doctor)}
              className="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative z-10">Book Now</span>
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"
                initial={false}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingElements />

      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50"
        style={{ y: backgroundY }}
      />

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
        <audio ref={audioRef} src="/Payment.mp3" />

        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div className="text-center mb-16 pt-20" style={{ y: textY }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.h1
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-teal-700 to-cyan-700 bg-clip-text text-transparent mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Find Your Healthcare Professional
              </motion.h1>
              <motion.p
                className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Connect with qualified medical specialists and book appointments
                with ease
              </motion.p>
            </motion.div>

            {/* Animated Icons */}
            <motion.div
              className="flex justify-center space-x-8 mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[Stethoscope, Heart, Activity].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    },
                    hover: { duration: 0.3 },
                  }}
                >
                  <Icon className="w-8 h-8 text-teal-600" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12 border border-white/50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              scale: 1.01,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Search Doctors
                </label>
                <div className="relative group">
                  <motion.div
                    className="absolute left-3 top-3"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-teal-500 transition-colors duration-200" />
                  </motion.div>
                  <input
                    type="text"
                    placeholder="Search by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Filter by Specialty
                </label>
                <div className="relative group">
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full py-4 px-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 appearance-none cursor-pointer"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    animate={{ rotate: selectedSpecialty ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Doctor List */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </motion.div>

          {/* Rating Section */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-16 border border-white/50"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              scale: 1.01,
            }}
          >
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent mb-4">
                Rate Your Experience
              </h2>
              <p className="text-slate-600 text-lg">
                Help others by sharing your experience with our healthcare
                professionals
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Doctor
                </label>
                <select className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm">
                  <option value="">Choose a doctor to review</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Your Rating
                </label>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, index) => (
                    <motion.button
                      key={index}
                      className="text-3xl focus:outline-none mx-2 transition-transform"
                      onClick={() => setRating(index + 1)}
                      onMouseEnter={() => setHover(index + 1)}
                      onMouseLeave={() => setHover(0)}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Star
                        className={`w-10 h-10 ${
                          index + 1 <= (hover || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-slate-300"
                        } transition-colors duration-200`}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-sm text-slate-500 mt-3">
                  Click to rate
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Your Review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4"
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="Share your experience with this healthcare professional..."
                />
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.button
                  onClick={submitReview}
                  disabled={rating === 0}
                  className="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-8 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  <span className="relative z-10">Submit Review</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />

            <motion.div
              className="text-center mb-12 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-teal-100">
                Your health is our priority
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <motion.div
                  className="inline-block p-4 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-colors duration-300"
                  whileHover={{ rotate: 10 }}
                >
                  <Users className="w-8 h-8" />
                </motion.div>
                <AnimatedCounter end={500} suffix="+" />
                <div className="text-teal-100 text-lg">Qualified Doctors</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <motion.div
                  className="inline-block p-4 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-colors duration-300"
                  whileHover={{ rotate: 10 }}
                >
                  <Heart className="w-8 h-8" />
                </motion.div>
                <AnimatedCounter end={10000} suffix="+" />
                <div className="text-teal-100 text-lg">Happy Patients</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <motion.div
                  className="inline-block p-4 bg-white/10 rounded-2xl mb-4 group-hover:bg-white/20 transition-colors duration-300"
                  whileHover={{ rotate: 10 }}
                >
                  <Award className="w-8 h-8" />
                </motion.div>
                <AnimatedCounter end={50} suffix="+" />
                <div className="text-teal-100 text-lg">Medical Specialties</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Sign In Prompt Modal */}
        <AnimatePresence>
          {showSignInPrompt && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/50"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ duration: 0.4, type: "spring", damping: 25 }}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Shield className="w-10 h-10 text-teal-600" />
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-slate-800 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    Sign In Required
                  </motion.h2>
                  <motion.p
                    className="text-slate-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    Please sign in to book an appointment with{" "}
                    {selectedDoctor?.name}
                  </motion.p>
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <SignInButton mode="modal">
                    <motion.button
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-4 rounded-2xl font-semibold shadow-lg"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </motion.button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <motion.button
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-4 rounded-2xl font-semibold shadow-lg"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create Account
                    </motion.button>
                  </SignUpButton>

                  <motion.button
                    onClick={() => setShowSignInPrompt(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 px-4 rounded-2xl font-semibold transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && selectedDoctor && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto border border-white/50"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ duration: 0.4, type: "spring", damping: 25 }}
              >
                {!paymentSuccess ? (
                  <>
                    <motion.div
                      className="text-center mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent mb-6">
                        Book Appointment
                      </h2>

                      <div className="flex items-center justify-center mb-6">
                        <motion.img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="h-20 w-20 rounded-2xl object-cover ring-4 ring-teal-100 mr-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        />
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-slate-800">
                            {selectedDoctor.name}
                          </h3>
                          <p className="text-teal-600 font-semibold">
                            {selectedDoctor.specialty}
                          </p>
                          <p className="text-sm text-slate-500">
                            {selectedDoctor.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <form
                      onSubmit={handleAppointmentBooking}
                      className="space-y-6"
                    >
                      <motion.div
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
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
                            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
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
                            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter email address"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="patientPhone"
                          value={appointmentData.patientPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          placeholder="+91 98765 43210"
                        />
                      </motion.div>

                      <motion.div
                        className="grid md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                      >
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-3">
                            <Calendar className="inline w-4 h-4 mr-2" />
                            Select Date *
                          </label>
                          <input
                            type="date"
                            name="appointmentDate"
                            value={appointmentData.appointmentDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split("T")[0]}
                            required
                            className="w-full p-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-3">
                            <Clock className="inline w-4 h-4 mr-2" />
                            Select Time *
                          </label>
                          <select
                            name="appointmentTime"
                            value={appointmentData.appointmentTime}
                            onChange={handleInputChange}
                            required
                            className="w-full p-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          >
                            <option value="">Choose available time</option>
                            {selectedDoctor.availability.map((time, index) => (
                              <option key={index} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          <CreditCard className="inline w-4 h-4 mr-2" />
                          Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <motion.button
                            type="button"
                            onClick={() =>
                              setAppointmentData((prev) => ({
                                ...prev,
                                paymentMethod: "card",
                              }))
                            }
                            className={`p-4 rounded-2xl border-2 font-medium transition-all duration-300 ${
                              appointmentData.paymentMethod === "card"
                                ? "border-teal-500 bg-teal-50 text-teal-700"
                                : "border-slate-200 hover:border-slate-300 bg-white/50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Credit/Debit Card
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() =>
                              setAppointmentData((prev) => ({
                                ...prev,
                                paymentMethod: "upi",
                              }))
                            }
                            className={`p-4 rounded-2xl border-2 font-medium transition-all duration-300 ${
                              appointmentData.paymentMethod === "upi"
                                ? "border-teal-500 bg-teal-50 text-teal-700"
                                : "border-slate-200 hover:border-slate-300 bg-white/50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            UPI Payment
                          </motion.button>
                        </div>

                        <AnimatePresence>
                          {appointmentData.paymentMethod === "card" && (
                            <motion.div
                              className="space-y-4 p-6 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Card Number
                                </label>
                                <input
                                  type="text"
                                  name="number"
                                  value={formatCardNumber(cardDetails.number)}
                                  onChange={handleCardInputChange}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Cardholder Name
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={cardDetails.name}
                                  onChange={handleCardInputChange}
                                  placeholder="John Doe"
                                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Expiry Date
                                  </label>
                                  <input
                                    type="text"
                                    name="expiry"
                                    value={formatExpiry(cardDetails.expiry)}
                                    onChange={handleCardInputChange}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    CVV
                                  </label>
                                  <input
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleCardInputChange}
                                    placeholder="123"
                                    maxLength={3}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {appointmentData.paymentMethod === "upi" && (
                            <motion.div
                              className="p-6 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                UPI ID
                              </label>
                              <input
                                type="text"
                                placeholder="yourname@upi"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                              />
                              <p className="text-xs text-slate-500 mt-2">
                                You will be redirected to your UPI app for
                                payment
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Additional Notes
                        </label>
                        <textarea
                          name="notes"
                          value={appointmentData.notes}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm"
                          placeholder="Any specific concerns or requirements for your appointment..."
                        />
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-slate-800">
                            Total Amount:
                          </span>
                          <motion.span
                            className="text-3xl font-bold text-teal-600"
                            whileHover={{ scale: 1.1 }}
                          >
                            ₹{selectedDoctor.price}
                          </motion.span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 }}
                      >
                        <motion.button
                          type="button"
                          onClick={() => {
                            setShowBookingModal(false);
                            setIsSubmitting(false);
                          }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 px-4 rounded-2xl font-semibold transition-colors duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-2 relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-teal-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                          />
                          <span className="relative z-10">
                            {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                                />
                                Booking Appointment...
                              </div>
                            ) : (
                              "Book Appointment & Pay"
                            )}
                          </span>
                        </motion.button>
                      </motion.div>

                      {/* Status Messages */}
                      <AnimatePresence>
                        {submitStatus === "success" && (
                          <motion.div
                            className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center space-x-3"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                          >
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
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
                            </motion.div>
                            <div>
                              <p className="font-semibold">
                                Appointment booked successfully!
                              </p>
                              <p className="text-sm">
                                Confirmation details sent to your email.
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {submitStatus === "error" && (
                          <motion.div
                            className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center space-x-3"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                          >
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
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
                            </motion.div>
                            <div>
                              <p className="font-semibold">
                                Failed to book appointment
                              </p>
                              <p className="text-sm">{errorMessage}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <svg
                          className="w-12 h-12 text-green-600"
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
                      </motion.div>
                    </motion.div>
                    <motion.h3
                      className="text-3xl font-bold text-slate-800 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      Appointment Booked!
                    </motion.h3>
                    <motion.p
                      className="text-slate-600 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      Your appointment with {selectedDoctor.name} has been
                      confirmed.
                    </motion.p>
                    <motion.div
                      className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-2xl border border-teal-200 max-w-sm mx-auto"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <p className="text-teal-800 font-semibold mb-2">
                        Appointment Details:
                      </p>
                      <p className="text-teal-700">
                        Date: {appointmentData.appointmentDate}
                      </p>
                      <p className="text-teal-700">
                        Time: {appointmentData.appointmentTime}
                      </p>
                      <p className="text-teal-700">
                        Fee: ₹{selectedDoctor.price}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorList;
