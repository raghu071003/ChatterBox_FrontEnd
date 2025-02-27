import { useState } from 'react'
import React from 'react'
import './App.css'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignUpPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <LoginPage /> */}
      <SignupPage />
    </>
  )
}

export default App
