import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    priority: "medium",
    department: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          priority: "medium",
          department: "general",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to submit form");
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

  const contactMethods = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email Support",
      primary: "support@medimage.com",
      secondary: "Response within 2-4 hours",
      description:
        "Get comprehensive help with appointments, technical issues, and general inquiries",
      action: "mailto:support@medimage.com",
      color: "teal",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Phone Support",
      primary: "+91 1800-MediMage",
      secondary: "Mon-Sat, 8 AM - 10 PM IST",
      description:
        "Speak directly with our certified healthcare support specialists",
      action: "tel:+911800medimage",
      color: "cyan",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "Live Chat",
      primary: "Chat with us now",
      secondary: "Average response: 60 seconds",
      description: "Real-time assistance from our medical support agents",
      action: "#chat",
      color: "blue",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      title: "Emergency Support",
      primary: "+91 98765-URGENT",
      secondary: "24/7 Emergency Assistance",
      description: "Immediate support for urgent medical appointment needs",
      action: "tel:+919876543210",
      color: "red",
    },
  ];

  const officeLocations = [
    {
      city: "Mumbai Headquarters",
      address:
        "MediMage Tower, 123 Healthcare Boulevard, Bandra Kurla Complex, Mumbai 400051",
      phone: "+91 22 6789 0000",
      email: "mumbai@medimage.com",
      hours: "Mon-Sat: 8 AM - 9 PM",
      services: [
        "General Consultations",
        "Specialist Care",
        "Emergency Support",
      ],
    },
    {
      city: "Delhi Branch",
      address:
        "Health Plaza, 456 Medical District, Connaught Place, New Delhi 110001",
      phone: "+91 11 5678 9000",
      email: "delhi@medimage.com",
      hours: "Mon-Sat: 7 AM - 10 PM",
      services: ["Telemedicine Hub", "Corporate Health", "Wellness Programs"],
    },
    {
      city: "Bangalore Center",
      address:
        "TechMed Campus, 789 Innovation Drive, Electronic City, Bangalore 560100",
      phone: "+91 80 4567 8900",
      email: "bangalore@medimaga.com",
      hours: "Mon-Sun: 8 AM - 8 PM",
      services: ["R&D Center", "Digital Health", "AI Diagnostics"],
    },
  ];

  const faqItems = [
    {
      question: "How do I book my first appointment on MediMaga?",
      answer:
        "After signing up, browse our verified doctors by specialty or location. Select your preferred doctor, choose an available time slot, and complete the secure payment process. You'll receive instant confirmation via email and SMS.",
    },
    {
      question: "Can I cancel or reschedule appointments?",
      answer:
        "Yes! You can reschedule up to 4 hours before your appointment time and cancel up to 2 hours prior. Cancellations made within the allowed timeframe receive full refunds processed within 3-5 business days.",
    },
    {
      question: "What should I do for medical emergencies?",
      answer:
        "For life-threatening emergencies, call 108 immediately or visit the nearest emergency room. For urgent but non-emergency medical concerns, use our 24/7 emergency support line to connect with on-call medical professionals.",
    },
    {
      question: "How secure is my personal health information?",
      answer:
        "MediMage employs bank-level encryption and follows strict HIPAA compliance standards. Your data is stored in secure, encrypted servers and never shared with third parties without your explicit consent.",
    },
    {
      question: "Do you accept health insurance?",
      answer:
        "We work with major insurance providers across India. During booking, you can verify your insurance coverage and pre-authorize treatments. Our billing team assists with insurance claims and documentation.",
    },
    {
      question: "How do I access telemedicine consultations?",
      answer:
        "Telemedicine appointments are available through our secure video platform. You'll receive a consultation link via email 15 minutes before your appointment. Ensure you have a stable internet connection and a device with camera/microphone capabilities.",
    },
  ];

  const departments = [
    { value: "general", label: "General Inquiry" },
    { value: "appointments", label: "Appointments & Scheduling" },
    { value: "billing", label: "Billing & Insurance" },
    { value: "technical", label: "Technical Support" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "partnerships", label: "Doctor Partnerships" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 text-white py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">We're Here to Help</h1>
          <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
            Whether you need support with appointments, have questions about our
            services, or want to provide feedback, our dedicated team is ready
            to assist you 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <ContactMethodCard key={index} method={method} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-teal-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                  Send us a Message
                </h2>
                <p className="text-slate-600 text-lg">
                  Our medical support team typically responds within 2-4 hours
                  during business hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    >
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Priority Level
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="low">
                        Low Priority (General inquiry)
                      </option>
                      <option value="medium">
                        Medium Priority (Standard support)
                      </option>
                      <option value="high">
                        High Priority (Urgent assistance)
                      </option>
                      <option value="urgent">
                        Urgent (Immediate attention needed)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Please provide detailed information about your inquiry, including any relevant appointment details, error messages, or specific concerns..."
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-slate-600 leading-relaxed"
                    >
                      I consent to the processing of my personal data in
                      accordance with MediMage's
                      <a
                        href="#"
                        className="text-teal-600 hover:text-teal-700 font-medium ml-1"
                      >
                        Privacy Policy
                      </a>{" "}
                      and
                      <a
                        href="#"
                        className="text-teal-600 hover:text-teal-700 font-medium ml-1"
                      >
                        Terms of Service
                      </a>
                      . I understand that my information will be used solely for
                      responding to this inquiry.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </>
                  )}
                </button>

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
                      <p className="font-semibold">
                        Message sent successfully!
                      </p>
                      <p className="text-sm">
                        We'll get back to you within 2-4 hours during business
                        hours.
                      </p>
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
                      <p className="font-semibold">Failed to send message</p>
                      <p className="text-sm">
                        Please try again or contact us directly via phone or
                        email.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Office Locations */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Our Locations
              </h3>
              <div className="space-y-6">
                {officeLocations.map((location, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-100 last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">
                          {location.city}
                        </h4>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                          {location.address}
                        </p>
                      </div>
                    </div>

                    <div className="ml-5 space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-slate-700">{location.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-slate-700">{location.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-teal-600 font-medium">
                          {location.hours}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-slate-500 mb-1">
                          Services Available:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {location.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-teal-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
                <p className="text-sm text-teal-800">
                  <span className="font-semibold">Need more help?</span> Visit
                  our comprehensive
                  <a
                    href="#"
                    className="text-teal-600 hover:text-teal-700 font-medium ml-1"
                  >
                    Help Center
                  </a>{" "}
                  for detailed guides and tutorials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-16 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-red-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h4 className="text-lg font-bold text-red-800 mb-2">
                Medical Emergency Notice
              </h4>
              <p className="text-red-700 mb-3">
                If you are experiencing a medical emergency, do not use this
                contact form. Call <span className="font-semibold">108</span>{" "}
                (Emergency Services) or visit your nearest emergency room
                immediately.
              </p>
              <p className="text-red-600 text-sm">
                For urgent but non-emergency medical concerns, use our 24/7
                emergency support line:
                <span className="font-semibold ml-1">+91 98765-URGENT</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactMethodCard({ method }) {
  const colorClasses = {
    teal: "from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
    cyan: "from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700",
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div
        className={`mx-auto w-16 h-16 bg-gradient-to-r ${
          colorClasses[method.color]
        } rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}
      >
        {method.icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{method.title}</h3>
      <div className="mb-4">
        <a
          href={method.action}
          className="text-teal-600 font-semibold hover:text-teal-700 text-lg transition-colors duration-200"
        >
          {method.primary}
        </a>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {method.secondary}
        </p>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">
        {method.description}
      </p>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-b-0 pb-4 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-center justify-between py-3 hover:bg-slate-50 px-3 rounded-lg transition-colors duration-200"
      >
        <span className="font-semibold text-slate-800 text-sm pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 px-3 pb-2">
          <p className="text-sm text-slate-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
