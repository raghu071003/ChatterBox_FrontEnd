import React, { useContext, useEffect, useState } from 'react';
import { Camera, Edit2, Save, Clock, Bell, LogOut, Moon, Key, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProfilePicture from '../Components/ProfilePicture';

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    bio: '',
    email: ''
  });
  const [toggleUpload, setToggleUpload] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        name: user.fullName,
        email: user.email
      }));
    }
  }, [user]);
  
  const [formData, setFormData] = useState({ ...profileData });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData({ ...formData });
    setEditMode(false);
  };
  
  const cancelEdit = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Header - Redesigned without cover photo */}
        <div className="bg-white rounded-xl shadow-md">
          {toggleUpload && <ProfilePicture onClose={() => setToggleUpload(false)} />}
          
          <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <img 
                src={user ? user.profileImg : ""} 
                alt="Profile" 
                className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover shadow-md" 
              />
              <button 
                className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white shadow-md hover:bg-indigo-700 transition-colors"
                onClick={() => setToggleUpload(true)}
              >
                <Camera size={16} />
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.username}</p>
                <p className="mt-2 text-gray-700 max-w-md">{profileData.bio}</p>
              </div>
              
              {/* <button 
                onClick={() => setEditMode(true)} 
                className={`flex items-center px-4 py-2 mt-4 md:mt-0 rounded-md ${editMode ? 'hidden' : 'flex'} bg-indigo-600 text-white hover:bg-indigo-700 transition-colors`}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </button> */}
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-indigo-600 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="text-white hover:text-indigo-200 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
              </div>
              
              {editMode ? (
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-gray-900">{profileData.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p className="mt-1 text-gray-900">{profileData.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-gray-900">{profileData.email}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                      <p className="mt-1 text-gray-900">{profileData.bio || "No bio information added yet."}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Settings Navigation */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-indigo-600">
                <h2 className="text-lg font-semibold text-white">Settings</h2>
              </div>
              <div className="divide-y divide-gray-200">
                <button className="flex items-center w-full px-4 py-3 hover:bg-indigo-50 transition-colors">
                  <Bell size={18} className="text-indigo-600 mr-3" />
                  <span className="text-gray-700">Notifications</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 hover:bg-indigo-50 transition-colors">
                  <Clock size={18} className="text-indigo-600 mr-3" />
                  <span className="text-gray-700">Activity Log</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 hover:bg-indigo-50 transition-colors">
                  <Key size={18} className="text-indigo-600 mr-3" />
                  <span className="text-gray-700">Password & Security</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 hover:bg-indigo-50 transition-colors">
                  <ShieldCheck size={18} className="text-indigo-600 mr-3" />
                  <span className="text-gray-700">Privacy</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 hover:bg-indigo-50 transition-colors">
                  <Moon size={18} className="text-indigo-600 mr-3" />
                  <span className="text-gray-700">Theme</span>
                </button>
                <button className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={18} className="mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;