import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalAppointments: 0,
    upcomingAppointments: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'contacts') {
        const response = await fetch('https://medimage-1.onrender.com/api/contact/view');
        const data = await response.json();
        
        if (data.success) {
          setContacts(data.contacts);
          updateStats({ contacts: data.contacts, appointments });
        } else {
          console.error('Failed to load contacts');
        }
      } else {
        const response = await fetch('https://medimage-1.onrender.com/api/appointments/view');
        const data = await response.json();
        
        if (data.success) {
          setAppointments(data.appointments);
          updateStats({ contacts, appointments: data.appointments });
        } else {
          console.error('Failed to load appointments');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const updateStats = (data) => {
    const today = new Date().toDateString();
    const now = new Date();
    
    setStats({
      totalContacts: data.contacts.length,
      newContacts: data.contacts.filter(c => (c.status || 'new') === 'new').length,
      totalAppointments: data.appointments.length,
      upcomingAppointments: data.appointments.filter(a => new Date(a.date) > now).length
    });
  };

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || (contact.status || 'new') === statusFilter;
      const matchesPriority = priorityFilter === 'all' || (contact.priority || 'medium') === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        default:
          return 0;
      }
    });

  // Filter and sort appointments
  const filteredAppointments = appointments
    .filter(appointment => {
      const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || (appointment.status || 'scheduled') === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        default:
          return 0;
      }
    });

  // View contact details
  const viewContact = (contact) => {
    setSelectedContact(contact);
    setSelectedAppointment(null);
    setShowModal(true);
  };

  // View appointment details
  const viewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedContact(null);
    setShowModal(true);
  };

const deleteContact = async (id) => {
  try {
    const response = await fetch(
      `https://medimage-1.onrender.com/api/contact/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setContacts((prev) => prev.filter((c) => c._id !== id));
      console.log("Deleted:", data.message);
    } else {
      console.error("Delete failed:", data.message);
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
};


  // Delete single appointment
 const deleteAppointment = async (id) => {
  try {
    const response = await fetch(
      `https://medimage-1.onrender.com/api/appointments/delete/${id}`,
      {
        method: "DELETE", // 👈 Important
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      // Remove from state so UI updates
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      console.log("Deleted:", data.message);
    } else {
      console.error("Delete failed:", data.message);
    }
  } catch (error) {
    console.error("Error deleting appointment:", error);
  }
};


  // Delete all items
  const deleteAllItems = async () => {
    const itemType = activeTab === 'contacts' ? 'contacts' : 'appointments';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete ALL ${itemType}?\n\nThis action cannot be undone!`)) return;
    
    try {
      const endpoint = activeTab === 'contacts' ? 'https://medimage-1.onrender.com/api/contact/delete-all' : 'https://medimage-1.onrender.com/api/appointments/delete-all';
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadData();
        alert(`All ${itemType} deleted successfully!`);
      } else {
        alert(`Failed to delete ${itemType}`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      alert(`Error deleting ${itemType}`);
    }
  };

  // Get priority badge style
  const getPriorityStyle = (priority) => {
    const p = priority || 'medium';
    const styles = {
      high: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200 shadow-sm',
      medium: 'bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border border-amber-200 shadow-sm',
      low: 'bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-800 border border-emerald-200 shadow-sm'
    };
    return styles[p] || styles.medium;
  };

  // Get status badge style
  const getStatusStyle = (status) => {
    const s = status || 'new';
    const styles = {
      new: 'bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm',
      replied: 'bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-800 border border-emerald-200 shadow-sm',
      closed: 'bg-gradient-to-r from-slate-50 to-gray-100 text-slate-800 border border-slate-200 shadow-sm',
      scheduled: 'bg-gradient-to-r from-cyan-50 to-blue-100 text-cyan-800 border border-cyan-200 shadow-sm',
      completed: 'bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-800 border border-emerald-200 shadow-sm',
      cancelled: 'bg-gradient-to-r from-red-50 to-rose-100 text-red-800 border border-red-200 shadow-sm'
    };
    return styles[s] || styles.new;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mark as replied
  const markAsReplied = async (id) => {
    try {
      const response = await fetch(`https://medimage-1.onrender.com/api/contact/update-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'replied' })
      });
      
      if (response.ok) {
        await loadData();
        alert('Status updated to replied!');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id, status) => {
    try {
      const response = await fetch(`https://medimage-1.onrender.com/api/appointments/update-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await loadData();
        alert(`Appointment marked as ${status}!`);
      } else {
        alert('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <div className="text-center mb-6 md:mb-10 overflow-hidden pt-8 md:pt-16">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 rounded-2xl md:rounded-3xl mb-4 md:mb-6 shadow-xl md:shadow-2xl">
            <svg className="w-6 h-6 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="overflow-hidden text-3xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2 md:mb-3">
            MediMage Admin
          </h1>
          <p className="text-slate-600 text-base md:text-xl font-medium overflow-hidden pt-2 md:pt-4">
            Patient care management
          </p>
        </div>

        {/* Tab Navigation - Responsive */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-xl mb-6 md:mb-8 border border-white/20 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 py-4 md:py-6 px-4 md:px-8 font-semibold text-base md:text-lg focus:outline-none transition-all duration-300 relative ${
                activeTab === 'contacts'
                  ? 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 text-white shadow-md md:shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 md:space-x-3">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">Messages</span>
                <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold ${
                  activeTab === 'contacts' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700'
                }`}>
                  {stats.totalContacts}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 py-4 md:py-6 px-4 md:px-8 font-semibold text-base md:text-lg focus:outline-none transition-all duration-300 relative ${
                activeTab === 'appointments'
                  ? 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 text-white shadow-md md:shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 md:space-x-3">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-1 4h6m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4m4 0H8m5-5v.01M12 12v.01" />
                </svg>
                <span className="truncate">Appointments</span>
                <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold ${
                  activeTab === 'appointments' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700'
                }`}>
                  {stats.totalAppointments}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {/* Stats cards with responsive padding and text sizes */}
          {[
            {
              title: activeTab === 'contacts' ? 'Total Contacts' : 'Total Appointments',
              value: activeTab === 'contacts' ? stats.totalContacts : stats.totalAppointments,
              border: 'border-teal-500',
              gradient: 'from-teal-100 to-cyan-100',
              iconColor: 'text-teal-600',
              textGradient: 'from-teal-600 to-blue-700'
            },
            {
              title: activeTab === 'contacts' ? 'New Messages' : 'Upcoming',
              value: activeTab === 'contacts' ? stats.newContacts : stats.upcomingAppointments,
              border: 'border-cyan-500',
              gradient: 'from-cyan-100 to-blue-100',
              iconColor: 'text-cyan-600',
              textGradient: 'from-cyan-600 to-blue-700'
            },
            {
              title: 'High Priority',
              value: activeTab === 'contacts' 
                ? contacts.filter(c => (c.priority || 'medium') === 'high').length
                : appointments.filter(a => (a.priority || 'medium') === 'high').length,
              border: 'border-purple-500',
              gradient: 'from-purple-100 to-indigo-100',
              iconColor: 'text-purple-600',
              textGradient: 'from-purple-600 to-indigo-700'
            },
            {
              title: activeTab === 'contacts' ? 'Replied' : 'Completed',
              value: activeTab === 'contacts' 
                ? contacts.filter(c => (c.status || 'new') === 'replied').length
                : appointments.filter(a => (a.status || 'scheduled') === 'completed').length,
              border: 'border-emerald-500',
              gradient: 'from-emerald-100 to-green-100',
              iconColor: 'text-emerald-600',
              textGradient: 'from-emerald-600 to-green-700'
            }
          ].map((stat, index) => (
            <div key={index} className={`bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-6 border-l-4 ${stat.border} hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group`}>
              <div className="flex items-center">
                <div className={`p-2 md:p-4 bg-gradient-to-br ${stat.gradient} rounded-xl md:rounded-2xl mr-4 md:mr-6 group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-6 h-6 md:w-8 md:h-8 ${stat.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* Icons remain the same */}
                  </svg>
                </div>
                <div>
                  <p className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${stat.textGradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-slate-600 text-xs md:text-sm font-semibold">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content - Responsive */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8 border border-white/20">
          {/* Header Controls - Responsive */}
          <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2">
                {activeTab === 'contacts' ? 'Contact Management' : 'Appointment Management'}
              </h2>
              <p className="text-slate-600 text-sm md:text-base lg:text-lg">
                {activeTab === 'contacts' 
                  ? 'Monitor and respond to patient inquiries'
                  : 'Oversee and manage all patient appointments'
                }
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 text-white rounded-lg md:rounded-xl hover:from-teal-700 hover:via-cyan-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-md hover:shadow-lg font-semibold text-sm md:text-base transform hover:scale-105"
              >
                <svg className={`w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={deleteAllItems}
                className="flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg md:rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm md:text-base transform hover:scale-105"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>
          </div>

          {/* Filters and Search - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
            >
              <option value="all">All Statuses</option>
              {activeTab === 'contacts' ? (
                <>
                  <option value="new">New Messages</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </>
              ) : (
                <>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm text-sm md:text-base"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort Options - Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg md:rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-3 sm:mb-0">
              <span className="text-xs md:text-sm font-semibold text-slate-700">Sort by:</span>
              <div className="flex flex-wrap gap-2">
                {['newest', 'oldest', 'priority'].map(option => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-lg md:rounded-xl font-semibold transition-all duration-200 ${
                      sortBy === option 
                        ? 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 text-white shadow-md transform scale-105' 
                        : 'bg-white/80 text-slate-700 hover:bg-white hover:shadow-md hover:scale-105'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-xs md:text-sm text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-800">
                {activeTab === 'contacts' ? filteredContacts.length : filteredAppointments.length}
              </span> of <span className="font-bold text-slate-800">
                {activeTab === 'contacts' ? contacts.length : appointments.length}
              </span> {activeTab}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12 md:py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-slate-200 border-t-cyan-600 mb-4 md:mb-6"></div>
              <p className="text-slate-600 font-semibold text-base md:text-lg">Loading {activeTab}...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && (
            (activeTab === 'contacts' ? filteredContacts.length === 0 : filteredAppointments.length === 0) && (
              <div className="text-center py-12 md:py-20">
                <div className="mx-auto w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-lg">
                  <svg className="w-10 h-10 md:w-16 md:h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {activeTab === 'contacts' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-1 4h6m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4m4 0H8m5-5v.01M12 12v.01" />
                    )}
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 md:mb-4">
                  No {activeTab} found
                </h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm md:text-base">
                  {activeTab === 'contacts' 
                    ? 'Patient contact forms will appear here once submitted.'
                    : 'Scheduled appointments will be displayed here once booked.'
                  }
                </p>
              </div>
            )
          )}

          {/* Tables - Made scrollable on mobile */}
          {!loading && activeTab === 'contacts' && filteredContacts.length > 0 && (
            <div className="overflow-hidden rounded-xl md:rounded-2xl border border-slate-200 shadow-lg md:shadow-xl bg-white/50 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] md:min-w-full">
                  <thead className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
                    <tr>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Patient Info</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Priority</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-slate-200">
                    {filteredContacts.map((contact, index) => (
                      <tr key={contact._id} className={`hover:bg-gradient-to-r hover:from-teal-50 hover:via-cyan-50 hover:to-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'}`}>
                        <td className="px-4 py-4 md:px-6 md:py-5 whitespace-nowrap">
                          <div className="text-xs md:text-sm font-semibold text-slate-800">{formatDate(contact.createdAt)}</div>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <div>
                            <div className="text-xs md:text-sm font-bold text-slate-800">{contact.name}</div>
                            <div className="text-xs md:text-sm text-slate-600 font-medium">{contact.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <div className="text-xs md:text-sm text-slate-800 font-medium max-w-xs truncate" title={contact.subject}>
                            {contact.subject}
                          </div>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <span className={`inline-flex px-2 py-1 md:px-3 md:py-1.5 text-xs font-bold rounded-full ${getPriorityStyle(contact.priority)}`}>
                            {(contact.priority || 'medium').charAt(0).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <span className={`inline-flex px-2 py-1 md:px-3 md:py-1.5 text-xs font-bold rounded-full ${getStatusStyle(contact.status)}`}>
                            {(contact.status || 'new').charAt(0).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <div className="flex flex-col sm:flex-row sm:space-x-1 md:space-x-2 space-y-1 sm:space-y-0">
                            <button
                              onClick={() => viewContact(contact)}
                              className="text-teal-600 hover:text-teal-800 transition-all duration-200 p-1 md:p-2 rounded md:rounded-lg hover:bg-teal-50 font-semibold text-xs md:text-sm transform hover:scale-105"
                              title="View Details"
                            >
                              View
                            </button>
                            {(contact.status || 'new') === 'new' && (
                              <button
                                onClick={() => markAsReplied(contact._id)}
                                className="text-emerald-600 hover:text-emerald-800 transition-all duration-200 p-1 md:p-2 rounded md:rounded-lg hover:bg-emerald-50 font-semibold text-xs md:text-sm transform hover:scale-105"
                                title="Mark as Replied"
                              >
                                Reply
                              </button>
                            )}
                            <button
                              onClick={() => deleteContact(contact._id)}
                              className="text-red-600 hover:text-red-800 transition-all duration-200 p-1 md:p-2 rounded md:rounded-lg hover:bg-red-50 font-semibold text-xs md:text-sm transform hover:scale-105"
                              title="Delete Contact"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Appointments Table - Responsive */}
          {!loading && activeTab === 'appointments' && filteredAppointments.length > 0 && (
            <div className="overflow-hidden rounded-xl md:rounded-2xl border border-slate-200 shadow-lg md:shadow-xl bg-white/50 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] md:min-w-full">
                  <thead className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
                    <tr>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Provider</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Priority</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-slate-200">
                    {filteredAppointments.map((appointment, index) => (
                      <tr key={appointment._id} className={`hover:bg-gradient-to-r hover:from-teal-50 hover:via-cyan-50 hover:to-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'}`}>
                        <td className="px-4 py-4 md:px-6 md:py-5 whitespace-nowrap">
                          <div className="text-xs md:text-sm font-bold text-slate-800">
                            {formatDate(appointment.date)}
                          </div>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <div>
                            <div className="text-xs md:text-sm font-bold text-slate-800">{appointment.patientName}</div>
                            <div className="text-xs md:text-sm text-slate-600 font-medium">{appointment.patientEmail}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <div className="text-xs md:text-sm font-bold text-slate-800">{appointment.doctorName}</div>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <span className={`inline-flex px-2 py-1 md:px-3 md:py-1.5 text-xs font-bold rounded-full ${getPriorityStyle(appointment.priority)}`}>
                            {(appointment.priority || 'medium').charAt(0).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <span className={`inline-flex px-2 py-1 md:px-3 md:py-1.5 text-xs font-bold rounded-full ${getStatusStyle(appointment.status)}`}>
                            {(appointment.status || 'scheduled').charAt(0).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 md:px-6 md:py-5">
                          <div className="flex flex-col sm:flex-row sm:space-x-1 md:space-x-2 space-y-1 sm:space-y-0">
                            <button
                              onClick={() => viewAppointment(appointment)}
                              className="text-teal-600 hover:text-teal-800 transition-all duration-200 p-1 md:p-2 rounded md:rounded-lg hover:bg-teal-50 font-semibold text-xs md:text-sm transform hover:scale-105"
                              title="View Details"
                            >
                              View
                            </button>
                            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                              <button
                                onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                                className="text-emerald-600 hover:text-emerald-800 transition-all duration-200 p-1 md:p-2 rounded md:rounded-lg hover:bg-emerald-50 font-semibold text-xs md:text-sm transform hover:scale-105"
                                title="Mark as Completed"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => deleteAppointment(appointment._id)}
                              className="text-red-600 hover:text-red-800 transition-all duration-200 p-1 md:p-2 rounded md:rounded-lg hover:bg-red-50 font-semibold text-xs md:text-sm transform hover:scale-105"
                              title="Delete Appointment"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals - Responsive */}
      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl lg:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2">Contact Details</h3>
                  <p className="text-slate-600 text-sm md:text-base lg:text-lg">Patient inquiry information</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-all duration-200 p-2 md:p-3 rounded-full hover:bg-slate-100 transform hover:scale-110"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal content with responsive adjustments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
                {/* ... modal content with responsive text sizes and padding ... */}
              </div>
              
              {/* Action buttons with responsive sizing */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-xs md:text-sm font-semibold text-slate-600">Message Received</p>
                  <p className="text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent">{formatDate(selectedContact.createdAt)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 md:px-6 md:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg md:rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
                  >
                    Close
                  </button>
                  {(selectedContact.status || 'new') === 'new' && (
                    <button
                      onClick={() => {
                        markAsReplied(selectedContact._id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg md:rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteContact(selectedContact._id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg md:rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-sm md:text-base"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal with similar responsive adjustments */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl lg:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Similar responsive adjustments as the contact modal */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
