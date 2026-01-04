import {useState, React } from 'react'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';


function App() {

  return (
  <div className='text-white'>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:postId/:slug" element={<DetailsPage />} />
    </Routes>
  </div>
  )
}

export default App