import React, { useContext,useEffect, useState } from 'react';
import { Camera, Edit2, Save, Clock, Bell, LogOut, Moon, Key, ShieldCheck, MessageSquare } from 'lucide-react';
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
  const [toggleUpload,setToggleUpload] = useState(false)
  const { user } = useContext(AuthContext);

  // Update state when user data is available
  useEffect(() => {
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        name: user.fullName, // Assuming 'fullName' exists in user object
        email: user.email
      }));
    }
  }, [user]); // Runs when 'user' changes
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
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Photo */}
          {toggleUpload && <ProfilePicture onClose={()=>setToggleUpload(false)}/>}
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <Camera size={20} className="text-gray-700" />
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pt-16 pb-6">
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <img 
                  src={user ? user.profileImg : ""} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md" 
                />
                <button className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full text-white shadow-md hover:bg-indigo-700 transition-colors" onClick={()=>setToggleUpload(true)}>
                  <Camera size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-start mt-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.username}</p>
              </div>
              
              <button 
                onClick={() => setEditMode(true)} 
                className={`flex items-center px-4 py-2 rounded-md ${editMode ? 'hidden' : 'flex'} bg-indigo-600 text-white hover:bg-indigo-700 transition-colors`}
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>
            
            <p className="mt-4 text-gray-700">{profileData.bio}</p>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            
            
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
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;