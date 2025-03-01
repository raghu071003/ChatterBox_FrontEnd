import { useContext } from 'react';
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

function App() {  
  return (
    <AuthProvider> 
      <AppContent />
    </AuthProvider>
  );
}
function AppContent() {
  const { loading,user } = useContext(AuthContext);

  if (loading) return <div>Loading..</div>;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<SignupPage />} />
        <Route path='/' element={user ? <HomePage /> : <LoginPage />} />
        <Route path='/profile' element={user ? <ProfilePage /> : <LoginPage />} />
        <Route path='/message' element={<Chat />} />
        <Route path='/contacts' element={user ? <ContactsList /> : <LoginPage />} />
        <Route path='/search' element={user ? <SearchUsers /> : <LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
