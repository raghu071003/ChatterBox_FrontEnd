import React, { useState, useEffect, useContext } from 'react';
import { Home, MessageSquare, Users, Bell, Search, Menu, X, User, User2,Gamepad } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import  logo from "../assets/Logo.png"
 
const Navbar = () => {
  
  
  const {user} = useContext(AuthContext)

  return user ? <NavigationBar /> : null;

};

export default Navbar;

const NavigationBar = ()=> {
  const [activeTab, setActiveTab] = useState('messages');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const navigate = useNavigate()
  const {user} = useContext(AuthContext)
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'Search', label: 'Search', icon: Search },
    { id: 'Games', label: 'Games', icon: Gamepad }
  ];
  useEffect(() => {
    if (activeTab === 'home') {
      navigate("/");
    }
    if(activeTab === 'profile'){
        navigate("/profile")
    }
    if(activeTab === 'contacts'){
        navigate("/contacts")
    }
    if(activeTab === 'Search'){
        navigate("/search")
    }
    if(activeTab === 'Games'){
        navigate("/play")
    }
  }, [activeTab]);
  return(
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-indigo-600 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className=" flex items-center flex-row gap-1">
            <img src={logo} alt="" width={40}  className=''/>
              <span className={`  text-2xl font-bold transition-colors duration-300 
                ${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
                MewMew
                
              </span>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center relative px-3 py-2 rounded-md transition-all duration-200  hover:cursor-pointer
                    ${activeTab === item.id 
                      ? (isScrolled ? 'text-indigo-600 bg-indigo-50' : 'text-white bg-indigo-700') 
                      : (isScrolled ? 'text-gray-600 hover:text-indigo-600' : 'text-indigo-100 hover:text-white')}`}
                >
                  <item.icon size={20} className="mr-2" />
                  <span>{item.label}</span>
                  
                  {/* Notification Badge */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Active Indicator */}
                  {activeTab === item.id && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-current transform origin-left transition-transform duration-300"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Profile Button */}
             <div className="hidden md:block">
              <button className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-200 hover:cursor-pointer
                ${isScrolled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-indigo-700 hover:bg-indigo-800'}`} onClick={()=>setActiveTab("profile")}>
                {user ? <img src={user.profileImg} alt="Profile" className="w-8 h-8 rounded-full" /> : <div>Loading</div>}
                <span className={`transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                  Profile
                </span>
              </button>
            </div> 
            

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition-colors duration-300 
                  ${isScrolled ? 'text-gray-600 hover:text-indigo-600' : 'text-white hover:bg-indigo-700'}`}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="transition-transform duration-300 transform rotate-90" />
                ) : (
                  <Menu size={24} className="transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 transition-opacity duration-300 md:hidden
        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-indigo-600">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} className="text-gray-500 hover:text-indigo-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-md transition-all duration-200
                    ${activeTab === item.id 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'}`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.label}</span>
                  
                  {/* Notification Badge */}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Profile in mobile menu */}
              <div className="pt-4 mt-6 border-t border-gray-200">
                <button className="flex items-center w-full px-4 py-3 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50">
                  {/* <img src={user.profileImg} size={20} className="mr-3" /> */}
                  
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content from going under navbar */}
      <div className={`${isScrolled ? 'h-16' : 'h-20'} transition-all duration-300`}></div> 
      
      
      
    </>
  )
}