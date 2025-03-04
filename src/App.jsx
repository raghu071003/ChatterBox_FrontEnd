import { useContext,useEffect } from 'react';
import React from 'react';
import './App.css';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignUpPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProfilePage from './Pages/Profile';
// import Message from './Pages/Message';
import Chat from './Pages/Message';
import ContactsList from './Pages/Contacts';
import SearchUsers from './Pages/Search';
import Loading from './Pages/Loading';
import {ToastContainer,toast} from "react-toastify"
import Games from './Pages/Games';
import ContactsOverlay from './Components/contactsOverlay';
import RPS from './Pages/RockPaperScissors';

function App() {  
  return (
    <AuthProvider> 
      <AppContent />
    </AuthProvider>
  );
}
function Notifi({ notifications }) {
  useEffect(() => {
    if (notifications?.length > 0) {
      notifications.forEach((n) => {
        toast(n.message, {
          className: "toast-message",
        });
      });
    }
  }, [notifications]); // Re-run when notifications change

  return <ToastContainer />;
}
function AppContent() {
  const { loading,user,notifications} = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Navbar />
      <Notifi notifications={notifications}/>
      {loading ?<Loading /> :<Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<SignupPage />} />
        <Route path='/' element={user ? <HomePage /> : <LoginPage />} />
        <Route path='/profile' element={user ? <ProfilePage /> : <LoginPage />} />
        <Route path='/message' element={<Chat />} />
        <Route path='/contacts' element={user ? <ContactsList /> : <LoginPage />} />
        <Route path='/search' element={user ? <SearchUsers /> : <LoginPage />} />
        <Route path='/play' element={user ? <Games /> : <LoginPage />} />
        <Route path='/play/rps' element={user ? <RPS /> : <LoginPage />} />
        <Route path='/message/:contactId' element={user ? <HomePage /> : <LoginPage />} />
        {/* <Route path='/check' element={<ContactsOverlay isOpen={true} onClose={false} />} /> */}
      </Routes>}
    </BrowserRouter>
  );
}

export default App;
