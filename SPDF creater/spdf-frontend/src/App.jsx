import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Download from './pages/Download';
import Create from './pages/Create';
import appLogo from './media/app.png';
import './App.css';

function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={appLogo} alt="SPDF Logo" className="logo-img" />
        SPDF Reader
      </div>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/create" className={({ isActive }) => isActive ? "active" : ""}>Create SPDF</NavLink>
        <NavLink to="/download" className={({ isActive }) => isActive ? "active" : ""}>Download</NavLink>
      </nav>
      <button className="btn btn-primary nav-cta" onClick={() => navigate('/create')}>
        Get Started →
      </button>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
