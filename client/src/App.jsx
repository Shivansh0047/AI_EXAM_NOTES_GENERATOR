import React, { useEffect } from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import History from './pages/History.jsx'
import Notes from './pages/Notes.jsx'
import Pricing from './pages/Pricing.jsx'
import { getCurrentUser } from './services/api.js'
import { useDispatch, useSelector } from 'react-redux'
export const serverUrl = "http://localhost:8000" // where server is, remomber we have alloweed cors to reverive req fomr frontend

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{ // Whenever we entre inside App, DOM is loaded or if user data is chnaged and getCurrentUser is called
    getCurrentUser(dispatch)
  },[dispatch])

  const {userData} = useSelector((state) => state.user) // Access userdata stored in state
  return (
    <Routes>
      <Route path='/' element={userData? <Home/>:<Navigate to="/auth" replace/>}/>
      <Route path='/auth' element={userData? <Navigate to="/" replace/>:<Auth />}/>
      <Route path='/history' element={userData? <History/>:<Navigate to="/auth" replace/>}/>
      <Route path='/notes' element={userData? <Notes/>:<Navigate to="/auth" replace/>}/>
      <Route path='/pricing' element={userData? <Pricing/>:<Navigate to="/auth" replace/>}/>
    </Routes>
  )
}

export default App