import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { auth } from './services/firebase';

// Layouts
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Category from './pages/Category';
import Watch from './pages/Watch';
import Admin from './pages/Admin';

function App() {
  // Anonymous login on mount to ensure Firebase Security Rules allow reading
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.error("Failed to sign in anonymously:", error);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:id" element={<Category />} />
          <Route path="watch/:id" element={<Watch />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;