import React, { useEffect, useState } from "react";
import BidderHomeNavBar from "../../Components/BidderComponent/BidderHomeNavBar";
import axios from "axios";
import { toast } from "react-hot-toast";

const DOMAIN = import.meta.env.VITE_DOMAIN;

const BidderProfile = () => {
  const [bidderData, setBidderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchedData = async () => {
    try {
      const res = await axios.get(
        `${DOMAIN}/bidder/get-bidder`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setBidderData(res.data?.data ?? {});
        setFormData(res.data?.data ?? {});
      }
    } catch (err) {
      console.log("Profile fetch error:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData(bidderData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `${DOMAIN}/bidder/update-profile`,
        { ...formData },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setBidderData(formData);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      console.log("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const getInitials = () => {
    if (bidderData.teamName) {
      return bidderData.teamName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return "BD";
  };

  const joinDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const stats = [
    { label: "Joined", value: joinDate.split(' ')[1], icon: "📅" },
    { label: "Auctions", value: "8", icon: "🎯" },
    { label: "Bids", value: bidderData.totalBids || "24", icon: "💰" },
    { label: "Won", value: bidderData.wonAuctions || "3", icon: "🏆" }
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600">
        <BidderHomeNavBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-400/30 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-slate-600 via-slate-200 to-slate-600">
      <BidderHomeNavBar />

      <div className="flex-1 w-full px-4 py-6 max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6">
          {/* Header with decorative element */}
          <div className="h-20 bg-gradient-to-r from-slate-700 to-slate-500 relative">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>
            
            {/* Profile Avatar - Centered */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-600 to-slate-400 flex items-center justify-center border-4 border-white shadow-xl">
                  <span className="text-2xl font-bold text-white">
                    {getInitials()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-slate-700 rounded-full border-2 border-white flex items-center justify-center hover:bg-slate-600 transition-colors shadow-lg">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-12 pb-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">
              {bidderData.teamName || "Team Name"}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-slate-600 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {bidderData.email || "team@example.com"}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {bidderData.location || "Mumbai, India"}
              </span>
            </div>

            <button
              onClick={handleEditToggle}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-center">
                    <span className="text-xl mb-1 block">{stat.icon}</span>
                    <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-600">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-1 mb-6">
          <div className="flex">
            {[
              { id: "profile", label: "Profile", icon: "👤" },
              { id: "bids", label: "My Bids", icon: "💰" },
              { id: "settings", label: "Settings", icon: "⚙️" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-700 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Personal Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-slate-500 rounded-full"></span>
                  Franchise Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Team Name", name: "teamName", value: bidderData.teamName, icon: "🏷️" },
                    { label: "Email Address", name: "email", value: bidderData.email, icon: "✉️" },
                    { label: "Phone Number", name: "phone", value: bidderData.phone, icon: "📱" },
                    { label: "Location", name: "location", value: bidderData.location, icon: "📍" }
                  ].map((field, index) => (
                    <div key={index}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        {field.label}
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {field.icon}
                          </span>
                          <input
                            type="text"
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all"
                          />
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700">
                          {field.value || `Not set`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={handleEditToggle}
                      className="px-5 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Purse Information */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-slate-500 rounded-full"></span>
                  Purse Details
                </h3>
                
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Available Purse</p>
                      <p className="text-3xl font-bold text-green-600">₹{bidderData.purse?.toLocaleString() || "0"}</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-center">
                        <p className="text-xs text-slate-600">Total Bids</p>
                        <p className="text-xl font-bold text-slate-700">{bidderData.totalBids || "24"}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-600">Won</p>
                        <p className="text-xl font-bold text-slate-700">{bidderData.wonAuctions || "3"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Section */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-slate-500 rounded-full"></span>
                  Team Members
                </h3>
                
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {[1,2,3].map((i) => (
                          <img
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                            src={`https://images.unsplash.com/photo-${i === 1 ? '1633332755192-727a05c4013d' : i === 2 ? '1535713875002-d1d0cf377fde' : '1438761681033-6461ffad8d80'}?w=100&h=100&fit=crop`}
                            alt="team member"
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Team Size: {bidderData.teamSize || "5"} members</p>
                        <p className="text-xs text-slate-600">Manage your franchise team</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                      Manage Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bids Tab */}
          {activeTab === "bids" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-slate-500 rounded-full"></span>
                Recent Bids
              </h3>
              
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-lg flex-shrink-0">
                        {i === 1 ? '🏏' : i === 2 ? '⚽' : '🏀'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {i === 1 ? 'Virat Kohli' : i === 2 ? 'MS Dhoni' : 'Rohit Sharma'}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              IPL 2024 • Bid: ₹{i === 1 ? '15' : i === 2 ? '12' : '14'}Cr
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              i === 1 ? 'bg-green-100 text-green-700 border border-green-200' : 
                              i === 2 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                              'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                              {i === 1 ? 'Winning' : i === 2 ? 'Outbid' : 'Lost'}
                            </span>
                            <span className="text-xs text-slate-500">{i*3}h ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-100 transition-all font-medium flex items-center justify-center gap-2">
                View All Bids
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-slate-500 rounded-full"></span>
                Account Settings
              </h3>
              
              <div className="space-y-2">
                {[
                  { icon: "🔒", label: "Password", desc: "Change your password" },
                  { icon: "🔔", label: "Notifications", desc: "Manage bid alerts" },
                  { icon: "💳", label: "Payment Methods", desc: "Add or remove payment options" },
                  { icon: "📋", label: "Bid Preferences", desc: "Set automatic bid limits" }
                ].map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-base">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                          {item.label}
                        </span>
                        <p className="text-xs text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}

                <div className="pt-4">
                  <button className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-200 flex items-center justify-center text-red-700 text-base">
                        ⚠️
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-red-700 group-hover:text-red-800">
                          Deactivate Account
                        </span>
                        <p className="text-xs text-red-600">Temporarily deactivate your account</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidderProfile;