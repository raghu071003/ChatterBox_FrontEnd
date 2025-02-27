import { useState } from 'react'
import React from 'react'
import './App.css'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignUpPage'
import { BrowserRouter,Route, Routes } from "react-router-dom"
import HomePage from './Pages/HomePage'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path = '/register' element={<SignupPage />} />
          <Route path = '/' element = {<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
