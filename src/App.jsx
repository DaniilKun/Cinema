import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';



const App = () => {
  return(
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:repositoryId" element={<DetailPage />} />
    </Routes>
  )
}

export default App;
